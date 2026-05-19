import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function getSandboxMessageHtmlAnalysis({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const analysis = await sandboxClient.testing.messages.getHtmlAnalysis(
      sandboxId,
      message_id
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox message HTML analysis: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSandboxMessageHtmlAnalysis;
