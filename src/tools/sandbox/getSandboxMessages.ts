import { getSandboxClient } from "../../client";
import { GetMessagesRequest } from "../../types/mailtrap";

async function getMessages({
  test_inbox_id,
  page,
  last_id,
  search,
}: GetMessagesRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const inboxIdRaw = test_inbox_id ?? process.env.MAILTRAP_TEST_INBOX_ID;
    if (inboxIdRaw === undefined || inboxIdRaw === null) {
      throw new Error(
        "Provide test_inbox_id or set MAILTRAP_TEST_INBOX_ID environment variable for sandbox mode"
      );
    }

    const inboxId = Number(inboxIdRaw);
    if (Number.isNaN(inboxId)) {
      throw new Error(
        "test_inbox_id (or MAILTRAP_TEST_INBOX_ID) must be a valid number"
      );
    }

    const sandboxClient = getSandboxClient(inboxId);

    // Get messages from the inbox
    // MessageListOptions supports: page, last_id, and search
    const options: {
      page?: number;
      last_id?: number;
      search?: string;
    } = {};

    if (page !== undefined) {
      options.page = page;
    }
    if (last_id !== undefined) {
      options.last_id = last_id;
    }
    if (search !== undefined) {
      options.search = search;
    }

    const messages = await sandboxClient.testing.messages.get(
      inboxId,
      Object.keys(options).length > 0 ? options : undefined
    );

    if (!messages || messages.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No messages found in the sandbox inbox.",
          },
        ],
      };
    }

    const messageList = messages
      .map(
        (message: (typeof messages)[0]) =>
          `• Message ID: ${message.id}\n  From: ${message.from_email}\n  To: ${
            message.to_email
          }\n  Subject: ${message.subject}\n  Sent: ${
            message.sent_at
          }\n  Read: ${message.is_read ? "Yes" : "No"}\n`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${messages.length} message(s) in sandbox inbox:\n\n${messageList}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error getting messages:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to get messages: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getMessages;
