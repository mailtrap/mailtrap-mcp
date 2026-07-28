import { z } from "zod";

const getInboundMessageSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID.",
    },
    message_id: {
      type: "string",
      description: "The message ID.",
    },
  },
  required: ["inbox_id", "message_id"],
  additionalProperties: false,
};

export const getInboundMessageZod = z
  .object({
    inbox_id: z.number(),
    message_id: z.string(),
  })
  .strict();

export default getInboundMessageSchema;
