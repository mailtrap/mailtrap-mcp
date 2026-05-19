import { getSandboxClient } from "../../client";
import { ForwardSandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function forwardSandboxMessage({
  sandbox_id,
  message_id,
  email,
}: ForwardSandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    await sandboxClient.testing.messages.forward(sandboxId, message_id, email);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox message ${message_id} forwarded to ${email}.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to forward sandbox message: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default forwardSandboxMessage;
