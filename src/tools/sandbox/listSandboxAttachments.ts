import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";

async function listSandboxAttachments({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const attachments = await sandboxClient.testing.attachments.getList(
      sandboxId,
      message_id
    );

    if (!attachments || attachments.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No attachments on sandbox message ${message_id}.`,
          },
        ],
      };
    }

    const lines = attachments.map(
      (att: any) =>
        `• ${att.filename} (ID: ${att.id}, type: ${
          att.content_type ?? "?"
        }, size: ${att.attachment_size ?? "?"} bytes)`
    );

    return {
      content: [
        {
          type: "text",
          text: `Attachments on sandbox message ${message_id} (${
            attachments.length
          }):\n\n${lines.join("\n")}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to list sandbox attachments: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default listSandboxAttachments;
