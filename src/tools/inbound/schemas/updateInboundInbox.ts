import { z } from "zod";

const updateInboundInboxSchema = {
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
    name: {
      type: "string",
      description: "The new inbox name.",
    },
  },
  required: ["folder_id", "inbox_id", "name"],
  additionalProperties: false,
};

export const updateInboundInboxZod = z
  .object({
    folder_id: z.number(),
    inbox_id: z.number(),
    name: z.string(),
  })
  .strict();

export default updateInboundInboxSchema;
