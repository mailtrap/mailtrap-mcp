import { z } from "zod";

const listInboundForwardRulesSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID to list forward rules for.",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export const listInboundForwardRulesZod = z
  .object({
    inbox_id: z.number(),
  })
  .strict();

export default listInboundForwardRulesSchema;
