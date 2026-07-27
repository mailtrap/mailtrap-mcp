import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getInboundMessageZod } from "./schemas/getInboundMessage";

async function getInboundMessage(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getInboundMessageZod.safeParse(raw ?? {});
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

    const message = await mailtrap.inbound.messages.get(inboxId, messageId);

    return buildSuccessResponse(JSON.stringify(message, null, 2));
  } catch (error) {
    return buildErrorResponse("get inbound message", error);
  }
}

export default getInboundMessage;
