import { getSandboxClient } from "../../client";
import { SandboxAttachmentRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function getSandboxAttachment({
  sandbox_id,
  message_id,
  attachment_id,
}: SandboxAttachmentRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const attachment = await sandboxClient.testing.attachments.get(
      sandboxId,
      message_id,
      attachment_id
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(attachment, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox attachment: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSandboxAttachment;
