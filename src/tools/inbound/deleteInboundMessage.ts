import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { deleteInboundMessageZod } from "./schemas/deleteInboundMessage";

async function deleteInboundMessage(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = deleteInboundMessageZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { inbox_id: inboxId, message_id: messageId } = parsed.data;

    const mailtrap = requireClient("inbound messages", {
      requireAccountId: false,
    });

    await mailtrap.inbound.messages.delete(inboxId, messageId);

    return buildSuccessResponse(
      `Inbound message ${messageId} deleted successfully.`
    );
  } catch (error) {
    return buildErrorResponse("delete inbound message", error);
  }
}

export default deleteInboundMessage;
