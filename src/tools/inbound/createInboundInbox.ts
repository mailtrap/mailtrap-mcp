import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createInboundInboxZod } from "./schemas/createInboundInbox";

async function createInboundInbox(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createInboundInboxZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { folder_id: folderId, name, domain_id: domainId } = parsed.data;

    const mailtrap = requireClient("inbound inboxes", {
      requireAccountId: false,
    });

    const inbox = await mailtrap.inbound.inboxes.create(folderId, {
      name,
      ...(domainId !== undefined ? { domain_id: domainId } : {}),
    });

    return buildSuccessResponse(JSON.stringify(inbox, null, 2));
  } catch (error) {
    return buildErrorResponse("create inbound inbox", error);
  }
}

export default createInboundInbox;
