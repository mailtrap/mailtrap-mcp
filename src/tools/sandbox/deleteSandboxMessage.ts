import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteSandboxMessage({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    await sandboxClient.testing.messages.deleteMessage(sandboxId, message_id);

    return buildSuccessResponse(`Sandbox message ${message_id} deleted.`);
  } catch (error) {
    return buildErrorResponse("delete sandbox message", error);
  }
}

export default deleteSandboxMessage;
