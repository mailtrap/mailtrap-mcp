import { requireClient } from "../../client";
import { CleanSandboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function cleanSandbox({
  sandbox_id,
  inbox_id,
}: CleanSandboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    const inbox = await mailtrap.testing.inboxes.cleanInbox(resolvedInboxId);

    return buildSuccessResponse(
      `All messages deleted from sandbox:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}\n• Emails remaining: ${inbox.emails_count}`
    );
  } catch (error) {
    return buildErrorResponse("clean sandbox", error);
  }
}

export default cleanSandbox;
