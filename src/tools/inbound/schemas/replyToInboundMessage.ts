import { z } from "zod";

import { sendMessageProperties, sendMessageZodShape } from "./sendFields";

const replyToInboundMessageSchema = {
  type: "object",
  properties: {
    inbox_id: { type: "number", description: "The inbox ID." },
    message_id: { type: "string", description: "The message ID to reply to." },
    ...sendMessageProperties,
  },
  required: ["inbox_id", "message_id"],
  additionalProperties: false,
};

export const replyToInboundMessageZod = z
  .object({
    inbox_id: z.number(),
    message_id: z.string(),
    ...sendMessageZodShape,
  })
  .strict();

export default replyToInboundMessageSchema;
