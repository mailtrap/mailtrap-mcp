import { requireClient } from "../../client";
import { GetSandboxInboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxInbox({
  inbox_id,
}: GetSandboxInboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    const inboxIdRaw = inbox_id ?? process.env.MAILTRAP_TEST_INBOX_ID;
    if (inboxIdRaw === undefined || inboxIdRaw === null) {
      throw new Error(
        "Provide inbox_id or set MAILTRAP_TEST_INBOX_ID environment variable"
      );
    }

    const resolvedInboxId = Number(inboxIdRaw);
    if (Number.isNaN(resolvedInboxId)) {
      throw new Error(
        "inbox_id (or MAILTRAP_TEST_INBOX_ID) must be a valid number"
      );
    }

    const inbox = await mailtrap.testing.inboxes.getInboxAttributes(
      resolvedInboxId
    );

    return buildSuccessResponse(JSON.stringify(inbox, null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox inbox", error);
  }
}

export default getSandboxInbox;
