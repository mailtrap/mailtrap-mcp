import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listInboundMessagesZod } from "./schemas/listInboundMessages";

async function listInboundMessages(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listInboundMessagesZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { inbox_id: inboxId, last_id: lastId } = parsed.data;

    const mailtrap = requireClient("inbound messages", {
      requireAccountId: false,
    });

    const page = await mailtrap.inbound.messages.getList(
      inboxId,
      lastId ? { last_id: lastId } : undefined
    );

    const messages = page.data ?? [];

    if (messages.length === 0) {
      return buildSuccessResponse("No messages found in this inbox.");
    }

    const lines = messages
      .map((m) => {
        const attachments = m.attachments?.length
          ? `, ${m.attachments.length} attachment(s)`
          : "";
        return `• [${m.id}] from ${m.from ?? "—"} — "${
          m.subject ?? "(no subject)"
        }" (${m.received_at})${attachments}`;
      })
      .join("\n");

    let text = `Found ${messages.length} message(s) of ${page.total_count} total:\n\n${lines}`;
    if (page.last_id) {
      text += `\n\nNext page: pass last_id: "${page.last_id}" to fetch more.`;
    }

    return buildSuccessResponse(text);
  } catch (error) {
    return buildErrorResponse("list inbound messages", error);
  }
}

export default listInboundMessages;
