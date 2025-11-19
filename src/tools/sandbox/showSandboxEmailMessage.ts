import { sandboxClient } from "../../client";
import { ShowEmailMessageRequest } from "../../types/mailtrap";

async function showEmailMessage({
  message_id,
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
