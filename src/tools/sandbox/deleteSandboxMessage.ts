import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function deleteSandboxMessage({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    await sandboxClient.testing.messages.deleteMessage(sandboxId, message_id);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox message ${message_id} deleted.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to delete sandbox message: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default deleteSandboxMessage;
