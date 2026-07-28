import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { updateInboundInboxZod } from "./schemas/updateInboundInbox";

async function updateInboundInbox(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = updateInboundInboxZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { folder_id: folderId, inbox_id: inboxId, name } = parsed.data;

    const mailtrap = requireClient("inbound inboxes", {
      requireAccountId: false,
    });

    const inbox = await mailtrap.inbound.inboxes.update(folderId, inboxId, {
      name,
    });

    return buildSuccessResponse(JSON.stringify(inbox, null, 2));
  } catch (error) {
    return buildErrorResponse("update inbound inbox", error);
  }
}

export default updateInboundInbox;
