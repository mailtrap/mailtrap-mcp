import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listSandboxAttachments({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const attachments = await sandboxClient.testing.attachments.getList(
      sandboxId,
      message_id
    );

    if (!attachments || attachments.length === 0) {
      return buildSuccessResponse(
        `No attachments on sandbox message ${message_id}.`
      );
    }

    const lines = attachments.map(
      (att: any) =>
        `• ${att.filename} (ID: ${att.id}, type: ${
          att.content_type ?? "?"
        }, size: ${att.attachment_size ?? "?"} bytes)`
    );

    return buildSuccessResponse(
      `Attachments on sandbox message ${message_id} (${
        attachments.length
      }):\n\n${lines.join("\n")}`
    );
  } catch (error) {
    return buildErrorResponse("list sandbox attachments", error);
  }
}

export default listSandboxAttachments;
