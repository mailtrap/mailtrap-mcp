import { getSandboxClient } from "../../client";
import { UpdateSandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateSandboxMessage({
  sandbox_id,
  message_id,
  is_read,
}: UpdateSandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const message = await sandboxClient.testing.messages.updateMessage(
      sandboxId,
      message_id,
      { isRead: is_read }
    );

    return buildSuccessResponse(
      `Sandbox message ${message.id} marked as ${
        message.is_read ? "read" : "unread"
      }.`
    );
  } catch (error) {
    return buildErrorResponse("update sandbox message", error);
  }
}

export default updateSandboxMessage;
