import { requireClient } from "../../client";
import { type EmailLogMessageDetails } from "../../types/mailtrap";
import { getEmailLogMessageZod } from "./schemas/getEmailLogMessage";
import parseEmlBuffer from "./utils/parseEmlBuffer";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

/** API may include an error summary on the row (not always in SDK typings). */
type EmailLogMessageRow = EmailLogMessageDetails & { error?: string };

async function getEmailLogMessage(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getEmailLogMessageZod.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new Error(`Invalid input: ${msg}`);
    }

    const { message_id: messageId, include_content: includeContent } =
      parsed.data;

    const mailtrap = requireClient("email logs");

    const log = (await mailtrap.emailLogs.get(
      messageId
    )) as EmailLogMessageRow | null;

    if (log == null) {
      throw new Error(`Email log with message ID ${messageId} not found.`);
    }

    const result: Record<string, unknown> = { ...log };

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
          result.raw_content_error = `Failed to fetch (${rawResponse.status}).`;
        } else {
          const rawBuffer = Buffer.from(await rawResponse.arrayBuffer());
          const { htmlContent, textContent } = await parseEmlBuffer(rawBuffer);
          if (htmlContent) result.html_content = htmlContent;
          if (textContent) result.text_content = textContent;
          if (!htmlContent && !textContent) {
            result.raw_content_error = "No HTML or text body found in message.";
          }
        }
      } catch (rawErr) {
        clearTimeout(timeoutId);
        let rawErrMsg: string;
        if (rawErr instanceof Error && rawErr.name === "AbortError") {
          rawErrMsg = "Request timed out.";
        } else if (rawErr instanceof Error) {
          rawErrMsg = rawErr.message;
        } else {
          rawErrMsg = String(rawErr);
        }
        result.raw_content_error = `Error fetching or parsing — ${rawErrMsg}`;
      }
    }

    return buildSuccessResponse(JSON.stringify(result, null, 2));
  } catch (error) {
    return buildErrorResponse("get email log message", error);
  }
}

export default getEmailLogMessage;
