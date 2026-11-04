import { z } from "zod";

const deleteInboundForwardRuleSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID.",
    },
    forward_rule_id: {
      type: "number",
      description: "The forward rule ID.",
    },
  },
  required: ["inbox_id", "forward_rule_id"],
  additionalProperties: false,
};

export const deleteInboundForwardRuleZod = z
  .object({
    inbox_id: z.number(),
    forward_rule_id: z.number(),
  })
  .strict();

export default deleteInboundForwardRuleSchema;
