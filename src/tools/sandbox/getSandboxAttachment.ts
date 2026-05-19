import { getSandboxClient } from "../../client";
import { SandboxAttachmentRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxAttachment({
  sandbox_id,
  message_id,
  attachment_id,
}: SandboxAttachmentRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const attachment = await sandboxClient.testing.attachments.get(
      sandboxId,
      message_id,
      attachment_id
    );

    return buildSuccessResponse(JSON.stringify(attachment, null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox attachment", error);
  }
}

export default getSandboxAttachment;
