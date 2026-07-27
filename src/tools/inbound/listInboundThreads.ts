import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listInboundThreadsZod } from "./schemas/listInboundThreads";

async function listInboundThreads(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listInboundThreadsZod.safeParse(raw ?? {});
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

    const mailtrap = requireClient("inbound threads", {
      requireAccountId: false,
    });

    const page = await mailtrap.inbound.threads.getList(
      inboxId,
      lastId ? { last_id: lastId } : undefined
    );

    const threads = page.data ?? [];

    if (threads.length === 0) {
      return buildSuccessResponse("No threads found in this inbox.");
    }

    const lines = threads
      .map(
        (t) =>
          `• [${t.id}] "${t.subject ?? "(no subject)"}" — ${
            t.message_count
          } message(s), last activity ${t.last_activity_at}`
      )
      .join("\n");

    let text = `Found ${threads.length} thread(s) of ${page.total_count} total:\n\n${lines}`;
    if (page.last_id) {
      text += `\n\nNext page: pass last_id: "${page.last_id}" to fetch more.`;
    }

    return buildSuccessResponse(text);
  } catch (error) {
    return buildErrorResponse("list inbound threads", error);
  }
}

export default listInboundThreads;
