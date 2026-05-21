import { requireClient } from "../../client";
import { CleanSandboxInboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function cleanSandboxInbox({
  inbox_id,
}: CleanSandboxInboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    const inbox = await mailtrap.testing.inboxes.cleanInbox(inbox_id);

    return buildSuccessResponse(
      `Sandbox inbox ${inbox_id} cleaned.\n\n${JSON.stringify(inbox, null, 2)}`
    );
  } catch (error) {
    return buildErrorResponse("clean sandbox inbox", error);
  }
}

export default cleanSandboxInbox;
