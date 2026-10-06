import { z } from "zod";

import {
  forwardRuleProperties,
  forwardRuleZodShape,
} from "./forwardRuleFields";

const createInboundForwardRuleSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "The inbox ID to create the forward rule in.",
    },
    ...forwardRuleProperties,
  },
  required: ["inbox_id", "name"],
  additionalProperties: false,
};

export const createInboundForwardRuleZod = z
  .object({
    inbox_id: z.number(),
    name: forwardRuleZodShape.name,
    conditions: forwardRuleZodShape.conditions.optional(),
    destinations: forwardRuleZodShape.destinations.optional(),
  })
  .strict();

export default createInboundForwardRuleSchema;
