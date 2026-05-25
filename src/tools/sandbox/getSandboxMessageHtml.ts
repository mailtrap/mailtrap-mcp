import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageHtml({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const html = await sandboxClient.testing.messages.getHtmlMessage(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(html ?? "");
  } catch (error) {
    return buildErrorResponse("get sandbox message HTML body", error);
  }
}

export default getSandboxMessageHtml;
