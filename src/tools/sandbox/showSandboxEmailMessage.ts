import { getSandboxClient } from "../../client";
import { ShowEmailMessageRequest } from "../../types/mailtrap";
import { resolveLegacySandboxInboxId } from "./utils/resolveSandboxId";
import { buildErrorResponse } from "../utils/responses";

function formatSpamReport(data: unknown): string {
  if (data == null) return "No data.";
  const o =
    typeof data === "object" && data !== null && "res" in data
      ? (data as { res: Record<string, unknown> }).res
      : (data as Record<string, unknown>);
  if (typeof o === "object" && o !== null) {
    const lines: string[] = [];
    if (typeof o.score === "number")
      lines.push(`Spam score: ${o.score} (threshold typically 5)`);
    if (typeof o.report === "string") lines.push(`Report: ${o.report}`);
    if (Array.isArray(o.rules))
      lines.push(
        `Rules: ${(o.rules as unknown[]).map(String).join(", ") || "none"}`
      );
    if (lines.length) return lines.join("\n");
  }
  return JSON.stringify(data, null, 2);
}

function formatHtmlAnalysis(data: unknown): string {
  if (data == null) return "No data.";
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    const lines: string[] = [];
    if (typeof o.html_compatibility_score === "number")
      lines.push(`HTML compatibility score: ${o.html_compatibility_score}`);
    if (typeof o.text_compatibility_score === "number")
      lines.push(`Text compatibility score: ${o.text_compatibility_score}`);
    if (Array.isArray(o.problematic_elements) && o.problematic_elements.length)
      lines.push(
        `Problematic elements: ${(o.problematic_elements as unknown[]).join(
          ", "
        )}`
      );
    if (lines.length) return lines.join("\n");
  }
  return JSON.stringify(data, null, 2);
}

async function showEmailMessage({
  sandbox_id,
  test_inbox_id,
  message_id,
  include_spam_report = false,
  include_html_analysis = false,
}: ShowEmailMessageRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const inboxId = resolveLegacySandboxInboxId({ sandbox_id, test_inbox_id });

    const sandboxClient = getSandboxClient(inboxId);

    // Get message details
    // The showEmailMessage method takes inboxId and messageId
    const message = await sandboxClient.testing.messages.showEmailMessage(
      inboxId,
      message_id
    );

    if (!message) {
      return {
        content: [
          {
            type: "text",
            text: `Message with ID ${message_id} not found.`,
          },
        ],
        isError: true,
      };
    }

    // Get HTML and text content; either may not be available
    const htmlContent = await sandboxClient.testing.messages
      .getHtmlMessage(inboxId, message_id)
      .catch(() => "");
    const textContent = await sandboxClient.testing.messages
      .getTextMessage(inboxId, message_id)
      .catch(() => "");

    const messageDetails = [
      `Message ID: ${message.id}`,
      `From: ${message.from_email}`,
      `To: ${message.to_email}`,
      `Subject: ${message.subject}`,
      `Sent: ${message.sent_at}`,
      `Read: ${message.is_read ? "Yes" : "No"}`,
      message.html_body_size
        ? `HTML Size: ${message.html_body_size} bytes`
        : "",
      message.text_body_size
        ? `Text Size: ${message.text_body_size} bytes`
        : "",
      message.email_size ? `Total Size: ${message.email_size} bytes` : "",
    ]
      .filter(Boolean)
      .join("\n");

    let contentText = `Sandbox Email Message Details:\n\n${messageDetails}`;

    if (htmlContent) {
      contentText += `\n\n--- HTML Content ---\n${htmlContent}`;
    }

    if (textContent) {
      contentText += `\n\n--- Text Content ---\n${textContent}`;
    }

    if (!htmlContent && !textContent) {
      contentText += "\n\nNote: Message body content could not be retrieved.";
    }

    if (include_spam_report) {
      try {
        const spamReport = await sandboxClient.testing.messages.getSpamScore(
          inboxId,
          message_id
        );
        contentText += `\n\n--- Spam Report ---\n${formatSpamReport(
          spamReport
        )}`;
      } catch {
        contentText +=
          "\n\n--- Spam Report ---\nSpam report could not be retrieved.";
      }
    }

    if (include_html_analysis) {
      try {
        const htmlAnalysis =
          await sandboxClient.testing.messages.getHtmlAnalysis(
            inboxId,
            message_id
          );
        contentText += `\n\n--- HTML Analysis ---\n${formatHtmlAnalysis(
          htmlAnalysis
        )}`;
      } catch {
        contentText +=
          "\n\n--- HTML Analysis ---\nHTML analysis could not be retrieved.";
      }
    }

    return {
      content: [
        {
          type: "text",
          text: contentText,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("show sandbox email message", error);
  }
}

export default showEmailMessage;
