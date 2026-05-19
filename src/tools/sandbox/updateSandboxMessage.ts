import { getSandboxClient } from "../../client";
import { UpdateSandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function updateSandboxMessage({
  sandbox_id,
  message_id,
  is_read,
}: UpdateSandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const message = await sandboxClient.testing.messages.updateMessage(
      sandboxId,
      message_id,
      { isRead: is_read }
    );

    return {
      content: [
        {
          type: "text",
          text: `Sandbox message ${message.id} marked as ${
            message.is_read ? "read" : "unread"
          }.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to update sandbox message: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default updateSandboxMessage;
