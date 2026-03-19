import { client } from "../../client";
import { type EmailLogMessageDetails } from "../../types/mailtrap";
import { formatEmailLogEvent } from "./utils/emailLogEventFormat";
import { buildMessageSummaryLines } from "./utils/emailLogMessageSummary";
import { getEmailLogMessageZod } from "./schemas/getEmailLogMessage";
import parseEmlBuffer from "./utils/parseEmlBuffer";

/** API may include an error summary on the row (not always in SDK typings). */
type EmailLogMessageRow = EmailLogMessageDetails & { error?: string };

async function getEmailLogMessage(raw: unknown): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const parsed = getEmailLogMessageZod.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { message_id: messageId, include_content: includeContent } =
      parsed.data;

    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    if (
      !process.env.MAILTRAP_ACCOUNT_ID ||
      Number.isNaN(Number(process.env.MAILTRAP_ACCOUNT_ID))
    ) {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for email logs. Find it at https://mailtrap.io/account-management"
      );
    }

    const log = (await client.emailLogs.get(
      messageId
    )) as EmailLogMessageRow | null;

    if (log == null) {
      return {
        content: [
          {
            type: "text",
            text: `Email log with message ID ${messageId} not found.`,
          },
        ],
        isError: true,
      };
    }

    const lines = [
      `Message ID: ${log.message_id}`,
      "",
      ...buildMessageSummaryLines(log),
    ];

    if (log.events?.length) {
      lines.push(
        "",
        "Event history:",
        ...log.events.map((e) => formatEmailLogEvent(e))
      );
    }

    if (log.error) {
      lines.push("", `Error: ${log.error}`);
    }

    let contentText = `Email Log Details:\n\n${lines.join("\n")}`;

    if (includeContent && log.raw_message_url) {
      const RAW_FETCH_TIMEOUT_MS = 60_000;
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        RAW_FETCH_TIMEOUT_MS
      );
      try {
        const rawResponse = await fetch(log.raw_message_url, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!rawResponse.ok) {
          contentText += `\n\nRaw content: Failed to fetch (${rawResponse.status}).`;
        } else {
          const rawBuffer = Buffer.from(await rawResponse.arrayBuffer());
          const { htmlContent, textContent } = await parseEmlBuffer(rawBuffer);
          if (htmlContent) {
            contentText += `\n\n--- HTML Content ---\n${htmlContent}`;
          }
          if (textContent) {
            contentText += `\n\n--- Text Content ---\n${textContent}`;
          }
          if (!htmlContent && !textContent) {
            contentText +=
              "\n\nRaw content: No HTML or text body found in message.";
          }
        }
      } catch (rawErr) {
        clearTimeout(timeoutId);
        let rawErrMsg: string;
        if (rawErr instanceof Error && rawErr.name === "AbortError") {
          rawErrMsg = "Request timed out.";
        } else {
          rawErrMsg = rawErr instanceof Error ? rawErr.message : String(rawErr);
        }
        contentText += `\n\nRaw content: Error fetching or parsing — ${rawErrMsg}`;
      }
    }

    return {
      content: [{ type: "text", text: contentText }],
    };
  } catch (error) {
    console.error("Error getting email log message:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to get email log message: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getEmailLogMessage;
