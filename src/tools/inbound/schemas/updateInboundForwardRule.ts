import { z } from "zod";

import {
  forwardRuleProperties,
  forwardRuleZodShape,
} from "./forwardRuleFields";

const updateInboundForwardRuleSchema = {
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
    name: forwardRuleProperties.name,
    conditions: {
      ...forwardRuleProperties.conditions,
      description:
        "Replaces the whole condition set. An empty array removes all conditions, so the rule matches every message.",
    },
    destinations: {
      ...forwardRuleProperties.destinations,
      description:
        "Replaces the whole destination set. An empty array removes all destinations.",
    },
  },
  required: ["inbox_id", "forward_rule_id"],
  additionalProperties: false,
  description:
    "At least one of `name`, `conditions`, or `destinations` must be provided. Fields left out are unchanged.",
};

export const updateInboundForwardRuleZod = z
  .object({
    inbox_id: z.number(),
    forward_rule_id: z.number(),
    name: forwardRuleZodShape.name.optional(),
    conditions: forwardRuleZodShape.conditions.optional(),
    destinations: forwardRuleZodShape.destinations.optional(),
  })
  .strict()
  .refine(
    ({ inbox_id: _inboxId, forward_rule_id: _forwardRuleId, ...updates }) =>
      Object.keys(updates).length > 0,
    { message: "Provide at least one field to update." }
  );

export default updateInboundForwardRuleSchema;
