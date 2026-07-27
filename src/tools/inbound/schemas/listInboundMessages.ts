import { z } from "zod";

const listInboundMessagesSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID to list messages for.",
    },
    last_id: {
      type: "string",
      description: "Pagination cursor from a previous response's `last_id`.",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export const listInboundMessagesZod = z
  .object({
    inbox_id: z.number(),
    last_id: z.string().optional(),
  })
  .strict();

export default listInboundMessagesSchema;
