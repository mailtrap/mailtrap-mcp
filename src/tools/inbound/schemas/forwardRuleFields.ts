import { z } from "zod";

const MATCH_TYPES = ["sender", "recipient", "header"] as const;

const OPERATORS = [
  "equal",
  "not_equal",
  "contains",
  "starts_with",
  "ends_with",
  "empty",
  "not_empty",
] as const;

export const forwardRuleProperties = {
  name: {
    type: "string",
    description: "Rule name. Must be unique within the inbox.",
  },
  conditions: {
    type: "array",
    description:
      "Conditions that must all match. An empty array matches every message.",
    items: {
      type: "object",
      properties: {
        match_type: {
          type: "string",
          enum: MATCH_TYPES,
          description:
            "`sender` (From address), `recipient` (To/Cc addresses), or `header` (header named by `header_key`).",
        },
        operator: {
          type: "string",
          enum: OPERATORS,
          description:
            "Comparison operator. `empty` and `not_empty` are only valid for `header` conditions.",
        },
        value: {
          type: "string",
          description:
            "Text to compare against. Required for every operator except `empty` and `not_empty`.",
        },
        header_key: {
          type: "string",
          description: "Header name. Required when `match_type` is `header`.",
        },
      },
      required: ["match_type", "operator"],
      additionalProperties: false,
    },
  },
  destinations: {
    type: "array",
    description: "Addresses to forward matching messages to.",
    items: {
      type: "object",
      properties: {
        email: { type: "string", description: "Destination email address." },
      },
      required: ["email"],
      additionalProperties: false,
    },
  },
};

const conditionZod = z
  .object({
    match_type: z.enum(MATCH_TYPES),
    operator: z.enum(OPERATORS),
    value: z.string().optional(),
    header_key: z.string().optional(),
  })
  .strict();

const destinationZod = z.object({ email: z.string() }).strict();

export const forwardRuleZodShape = {
  name: z.string(),
  conditions: z.array(conditionZod),
  destinations: z.array(destinationZod),
};
