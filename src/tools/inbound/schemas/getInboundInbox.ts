import { z } from "zod";

const getInboundInboxSchema = {
  type: "object",
  properties: {
    folder_id: {
      type: "number",
      description: "The inbound folder ID.",
    },
    inbox_id: {
      type: "number",
      description: "The inbox ID.",
    },
  },
  required: ["folder_id", "inbox_id"],
  additionalProperties: false,
};

export const getInboundInboxZod = z
  .object({
    folder_id: z.number(),
    inbox_id: z.number(),
  })
  .strict();

export default getInboundInboxSchema;
