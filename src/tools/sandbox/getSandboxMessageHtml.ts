import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function getSandboxMessageHtml({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const html = await sandboxClient.testing.messages.getHtmlMessage(
      sandboxId,
      message_id
    );

    return {
      content: [{ type: "text", text: html ?? "" }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox message HTML body: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSandboxMessageHtml;
