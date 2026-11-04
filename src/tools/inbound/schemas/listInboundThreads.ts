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
    search: {
      type: "string",
      description:
        "Case-insensitive text matched against the thread subject and the from/to/cc/bcc addresses of its messages. Pass the same value when paginating.",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export const listInboundThreadsZod = z
  .object({
    inbox_id: z.number(),
    last_id: z.string().optional(),
    search: z.string().optional(),
  })
  .strict();

export default listInboundThreadsSchema;
