import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { replyToInboundMessageZod } from "./schemas/replyToInboundMessage";
import { buildInboundSendParams } from "./utils/sendParams";

async function replyToInboundMessage(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = replyToInboundMessageZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const {
      inbox_id: inboxId,
      message_id: messageId,
      ...rawFields
    } = parsed.data;

    const mailtrap = requireClient("inbound messages", {
      requireAccountId: false,
    });

    const params = buildInboundSendParams(rawFields);

    const result = await mailtrap.inbound.messages.reply(
      inboxId,
      messageId,
      params as Parameters<typeof mailtrap.inbound.messages.reply>[2]
    );

    return buildSuccessResponse(JSON.stringify(result, null, 2));
  } catch (error) {
    return buildErrorResponse("reply to inbound message", error);
  }
}

export default replyToInboundMessage;
