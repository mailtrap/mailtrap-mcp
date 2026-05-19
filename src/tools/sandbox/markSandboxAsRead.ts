import { requireClient } from "../../client";
import { SandboxIdRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function markSandboxAsRead({
  sandbox_id,
}: SandboxIdRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandbox = await mailtrap.testing.inboxes.markAsRead(sandbox_id);

    return buildSuccessResponse(
      `Marked all messages in sandbox "${sandbox.name}" (ID: ${sandbox.id}) as read.`
    );
  } catch (error) {
    return buildErrorResponse("mark sandbox as read", error);
  }
}

export default markSandboxAsRead;
