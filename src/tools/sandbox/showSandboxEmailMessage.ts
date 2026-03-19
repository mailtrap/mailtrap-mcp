import { sandboxClient } from "../../client";
import { ShowEmailMessageRequest } from "../../types/mailtrap";

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
  message_id,
  include_spam_report = false,
  include_html_analysis = false,
}: ShowEmailMessageRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const { MAILTRAP_TEST_INBOX_ID } = process.env;

    if (!MAILTRAP_TEST_INBOX_ID) {
      throw new Error(
        "MAILTRAP_TEST_INBOX_ID environment variable is required for sandbox mode"
      );
    }

    // Check if sandbox client is available
    if (!sandboxClient) {
      throw new Error(
        "Sandbox client is not available. Please set MAILTRAP_TEST_INBOX_ID environment variable."
      );
    }

    const inboxId = Number(MAILTRAP_TEST_INBOX_ID);

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

    // Get HTML and text content
    let htmlContent = "";
    let textContent = "";

    try {
      htmlContent = await sandboxClient.testing.messages.getHtmlMessage(
        inboxId,
        message_id
      );
    } catch (error) {
      // HTML might not be available
      console.warn("Could not retrieve HTML content:", error);
    }

    try {
      textContent = await sandboxClient.testing.messages.getTextMessage(
        inboxId,
        message_id
      );
    } catch (error) {
      // Text might not be available
      console.warn("Could not retrieve text content:", error);
    }

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
      } catch (error) {
        console.warn("Could not retrieve spam report:", error);
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
      } catch (error) {
        console.warn("Could not retrieve HTML analysis:", error);
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
    console.error("Error showing sandbox email message:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to show sandbox email message: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default showEmailMessage;
