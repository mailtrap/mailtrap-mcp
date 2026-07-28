import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getInboundInboxZod } from "./schemas/getInboundInbox";

async function getInboundInbox(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getInboundInboxZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { folder_id: folderId, inbox_id: inboxId } = parsed.data;

    const mailtrap = requireClient("inbound inboxes", {
      requireAccountId: false,
    });

    const inbox = await mailtrap.inbound.inboxes.get(folderId, inboxId);

    return buildSuccessResponse(JSON.stringify(inbox, null, 2));
  } catch (error) {
    return buildErrorResponse("get inbound inbox", error);
  }
}

export default getInboundInbox;
