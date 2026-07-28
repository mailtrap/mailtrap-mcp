import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listInboundInboxesZod } from "./schemas/listInboundInboxes";

async function listInboundInboxes(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listInboundInboxesZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { folder_id: folderId } = parsed.data;

    const mailtrap = requireClient("inbound inboxes", {
      requireAccountId: false,
    });

    const inboxes = await mailtrap.inbound.inboxes.getList(folderId);

    if (!inboxes || inboxes.length === 0) {
      return buildSuccessResponse(`No inboxes in folder ${folderId}.`);
    }

    const lines = inboxes
      .map(
        (i) => `• [${i.id}] ${i.name} — ${i.address} (domain ${i.domain_id})`
      )
      .join("\n");

    return buildSuccessResponse(
      `Found ${inboxes.length} inbox(es) in folder ${folderId}:\n\n${lines}`
    );
  } catch (error) {
    return buildErrorResponse("list inbound inboxes", error);
  }
}

export default listInboundInboxes;
