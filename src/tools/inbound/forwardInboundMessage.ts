import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { forwardInboundMessageZod } from "./schemas/forwardInboundMessage";
import { buildInboundSendParams } from "./utils/sendParams";

async function forwardInboundMessage(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = forwardInboundMessageZod.safeParse(raw ?? {});
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

    const params = buildInboundSendParams(rawFields);

    if (!params.to || params.to.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid input: `to` must contain at least one recipient to forward a message.",
          },
        ],
        isError: true,
      };
    }

    const mailtrap = requireClient("inbound messages", {
      requireAccountId: false,
    });

    const result = await mailtrap.inbound.messages.forward(
      inboxId,
      messageId,
      params as Parameters<typeof mailtrap.inbound.messages.forward>[2]
    );

    return buildSuccessResponse(JSON.stringify(result, null, 2));
  } catch (error) {
    return buildErrorResponse("forward inbound message", error);
  }
}

export default forwardInboundMessage;
