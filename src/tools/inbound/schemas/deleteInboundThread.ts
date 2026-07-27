import { z } from "zod";

const deleteInboundThreadSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID.",
    },
    thread_id: {
      type: "string",
      description: "The thread ID.",
    },
  },
  required: ["inbox_id", "thread_id"],
  additionalProperties: false,
};

export const deleteInboundThreadZod = z
  .object({
    inbox_id: z.number(),
    thread_id: z.string(),
  })
  .strict();

export default deleteInboundThreadSchema;
