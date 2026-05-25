import { getSandboxClient } from "../../client";
import { ForwardSandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function forwardSandboxMessage({
  sandbox_id,
  message_id,
  email,
}: ForwardSandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    await sandboxClient.testing.messages.forward(sandboxId, message_id, email);

    return buildSuccessResponse(
      `Sandbox message ${message_id} forwarded to ${email}.`
    );
  } catch (error) {
    return buildErrorResponse("forward sandbox message", error);
  }
}

export default forwardSandboxMessage;
