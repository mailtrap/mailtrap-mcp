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

    const { inbox_id: inboxId, last_id: lastId, search } = parsed.data;

    const mailtrap = requireClient("inbound threads", {
      requireAccountId: false,
    });

    const options = {
      ...(lastId ? { last_id: lastId } : {}),
      ...(search ? { search } : {}),
    };

    const page = await mailtrap.inbound.threads.getList(
      inboxId,
      Object.keys(options).length > 0 ? options : undefined
    );

    const threads = page.data ?? [];

    if (threads.length === 0) {
      return buildSuccessResponse(
        search
          ? `No threads matching "${search}" found in this inbox.`
          : "No threads found in this inbox."
      );
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
      text += search
        ? `\n\nNext page: pass last_id: "${page.last_id}" with the same search to fetch more.`
        : `\n\nNext page: pass last_id: "${page.last_id}" to fetch more.`;
    }

    return buildSuccessResponse(text);
  } catch (error) {
    return buildErrorResponse("list inbound threads", error);
  }
}

export default listInboundThreads;
