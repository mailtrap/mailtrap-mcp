import { requireClient } from "../../client";
import { UpdateSandboxInboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateSandboxInbox({
  inbox_id,
  name,
  email_username,
}: UpdateSandboxInboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    if (!name && !email_username) {
      throw new Error(
        "At least one of 'name' or 'email_username' must be provided"
      );
    }

    const params: Record<string, string> = {};
    if (name) params.name = name;
    if (email_username) params.emailUsername = email_username;

    const inbox = await mailtrap.testing.inboxes.updateInbox(
      inbox_id,
      params as { name: string; emailUsername: string }
    );

    return buildSuccessResponse(
      `Sandbox inbox ${inbox_id} updated.\n\n${JSON.stringify(inbox, null, 2)}`
    );
  } catch (error) {
    return buildErrorResponse("update sandbox inbox", error);
  }
}

export default updateSandboxInbox;
