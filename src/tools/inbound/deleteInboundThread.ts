import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { deleteInboundThreadZod } from "./schemas/deleteInboundThread";

async function deleteInboundThread(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = deleteInboundThreadZod.safeParse(raw ?? {});
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

    await mailtrap.inbound.threads.delete(inboxId, threadId);

    return buildSuccessResponse(
      `Inbound thread ${threadId} deleted successfully.`
    );
  } catch (error) {
    return buildErrorResponse("delete inbound thread", error);
  }
}

export default deleteInboundThread;
