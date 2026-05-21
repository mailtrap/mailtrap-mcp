import { requireClient } from "../../client";
import { DeleteSandboxInboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteSandboxInbox({
  inbox_id,
}: DeleteSandboxInboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    const inbox = await mailtrap.testing.inboxes.delete(inbox_id);

    return buildSuccessResponse(
      `Sandbox inbox ${inbox_id} deleted.\n\n${JSON.stringify(inbox, null, 2)}`
    );
  } catch (error) {
    return buildErrorResponse("delete sandbox inbox", error);
  }
}

export default deleteSandboxInbox;
