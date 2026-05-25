import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageHeaders({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const headers = await sandboxClient.testing.messages.getMailHeaders(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(JSON.stringify(headers, null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox message headers", error);
  }
}

export default getSandboxMessageHeaders;
