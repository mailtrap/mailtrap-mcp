import { z } from "zod";

import { sendMessageProperties, sendMessageZodShape } from "./sendFields";

const forwardInboundMessageSchema = {
  type: "object",
  properties: {
    inbox_id: { type: "number", description: "The inbox ID." },
    message_id: {
      type: "string",
      description: "The message ID to forward.",
    },
    ...sendMessageProperties,
  },
  required: ["inbox_id", "message_id", "to"],
  additionalProperties: false,
};

export const forwardInboundMessageZod = z
  .object({
    inbox_id: z.number(),
    message_id: z.string(),
    ...sendMessageZodShape,
  })
  .strict();

export default forwardInboundMessageSchema;
