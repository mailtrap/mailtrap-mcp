import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function getSandboxMessageHeaders({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const headers = await sandboxClient.testing.messages.getMailHeaders(
      sandboxId,
      message_id
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(headers, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox message headers: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSandboxMessageHeaders;
