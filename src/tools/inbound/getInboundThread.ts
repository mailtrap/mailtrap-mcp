import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getInboundThreadZod } from "./schemas/getInboundThread";

async function getInboundThread(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getInboundThreadZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { inbox_id: inboxId, thread_id: threadId } = parsed.data;

    const mailtrap = requireClient("inbound threads", {
      requireAccountId: false,
    });

    const thread = await mailtrap.inbound.threads.get(inboxId, threadId);

    return buildSuccessResponse(JSON.stringify(thread, null, 2));
  } catch (error) {
    return buildErrorResponse("get inbound thread", error);
  }
}

export default getInboundThread;
