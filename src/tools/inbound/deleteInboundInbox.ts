import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { deleteInboundInboxZod } from "./schemas/deleteInboundInbox";

async function deleteInboundInbox(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = deleteInboundInboxZod.safeParse(raw ?? {});
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

    await mailtrap.inbound.inboxes.delete(folderId, inboxId);

    return buildSuccessResponse(
      `Inbound inbox ${inboxId} deleted successfully.`
    );
  } catch (error) {
    return buildErrorResponse("delete inbound inbox", error);
  }
}

export default deleteInboundInbox;
