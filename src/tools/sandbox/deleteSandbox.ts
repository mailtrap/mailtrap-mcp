import { requireClient } from "../../client";
import { DeleteSandboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function deleteSandbox({
  sandbox_id,
  inbox_id,
}: DeleteSandboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    const inbox = await mailtrap.testing.inboxes.delete(resolvedInboxId);

    return buildSuccessResponse(
      `Sandbox deleted successfully:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}`
    );
  } catch (error) {
    return buildErrorResponse("delete sandbox", error);
  }
}

export default deleteSandbox;
