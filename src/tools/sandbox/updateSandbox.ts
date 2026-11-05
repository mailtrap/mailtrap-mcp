import { requireClient } from "../../client";
import { UpdateSandboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function updateSandbox({
  sandbox_id,
  inbox_id,
  name,
  email_username,
}: UpdateSandboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    if (!name && !email_username) {
      throw new Error(
        "At least one of 'name' or 'email_username' must be provided"
      );
    }

    const params: Record<string, string> = {};
    if (name) {
      params.name = name;
    }
    if (email_username) {
      params.emailUsername = email_username;
    }

    const inbox = await mailtrap.testing.inboxes.updateInbox(
      resolvedInboxId,
      params as { name: string; emailUsername: string }
    );

    return buildSuccessResponse(
      `Sandbox updated successfully:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}\n• Email address: ${inbox.email_username}@${inbox.email_domain}`
    );
  } catch (error) {
    return buildErrorResponse("update sandbox", error);
  }
}

export default updateSandbox;
