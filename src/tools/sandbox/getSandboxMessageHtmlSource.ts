import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function getSandboxMessageHtmlSource({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const source = await sandboxClient.testing.messages.getMessageHtmlSource(
      sandboxId,
      message_id
    );

    return {
      content: [{ type: "text", text: source ?? "" }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox message HTML source: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSandboxMessageHtmlSource;
