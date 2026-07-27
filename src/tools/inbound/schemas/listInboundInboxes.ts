import { z } from "zod";

const listInboundInboxesSchema = {
  type: "object",
  properties: {
    folder_id: {
      type: "number",
      description: "The inbound folder ID to list inboxes for.",
    },
  },
  required: ["folder_id"],
  additionalProperties: false,
};

export const listInboundInboxesZod = z
  .object({
    folder_id: z.number(),
  })
  .strict();

export default listInboundInboxesSchema;
