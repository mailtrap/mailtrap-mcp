import { getSandboxClient } from "../../client";
import { GetMessagesRequest } from "../../types/mailtrap";
import { resolveLegacySandboxInboxId } from "./utils/resolveSandboxId";
import { buildErrorResponse } from "../utils/responses";

async function getMessages({
  sandbox_id,
  test_inbox_id,
  page,
  last_id,
  search,
}: GetMessagesRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const inboxId = resolveLegacySandboxInboxId({ sandbox_id, test_inbox_id });

    const sandboxClient = getSandboxClient(inboxId);

    // Get messages from the sandbox
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
            text: "No messages found in the sandbox.",
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
          text: `Found ${messages.length} message(s) in the sandbox:\n\n${messageList}`,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("get messages", error);
  }
}

export default getMessages;
