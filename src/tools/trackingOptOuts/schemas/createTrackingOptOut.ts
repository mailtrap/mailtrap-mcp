import { z } from "zod";

const createTrackingOptOutSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "Email address to opt out of open and click tracking.",
    },
    domain_id: {
      type: "integer",
      minimum: 1,
      description:
        "ID of the sending domain the opt-out applies to, as returned by the Sending Domains tools.",
    },
  },
  required: ["email", "domain_id"],
  additionalProperties: false,
};

export const createTrackingOptOutZod = z
  .object({
    email: z.string().min(1),
    domain_id: z.number().int().min(1),
  })
  .strict();

export default createTrackingOptOutSchema;
