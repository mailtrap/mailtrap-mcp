import { z } from "zod";

const listInboundThreadsSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID to list threads for.",
    },
    last_id: {
      type: "string",
      description: "Pagination cursor from a previous response's `last_id`.",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export const listInboundThreadsZod = z
  .object({
    inbox_id: z.number(),
    last_id: z.string().optional(),
  })
  .strict();

export default listInboundThreadsSchema;
