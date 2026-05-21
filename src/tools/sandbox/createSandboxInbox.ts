import { requireClient } from "../../client";
import { CreateSandboxInboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createSandboxInbox({
  project_id,
  name,
}: CreateSandboxInboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    const inbox = await mailtrap.testing.inboxes.create(project_id, name);

    return buildSuccessResponse(
      `Sandbox inbox "${name}" created.\n\n${JSON.stringify(inbox, null, 2)}`
    );
  } catch (error) {
    return buildErrorResponse("create sandbox inbox", error);
  }
}

export default createSandboxInbox;
