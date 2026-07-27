import { z } from "zod";

const createInboundInboxSchema = {
  type: "object",
  properties: {
    folder_id: {
      type: "number",
      description: "The inbound folder ID to create the inbox in.",
    },
    name: {
      type: "string",
      description: "The inbox name.",
    },
    domain_id: {
      type: "number",
      description:
        "Optional. Attach the inbox to a custom sending domain (catch-all inbox). Omit for a standard Mailtrap-hosted inbox.",
    },
  },
  required: ["folder_id", "name"],
  additionalProperties: false,
};

export const createInboundInboxZod = z
  .object({
    folder_id: z.number(),
    name: z.string(),
    domain_id: z.number().optional(),
  })
  .strict();

export default createInboundInboxSchema;
