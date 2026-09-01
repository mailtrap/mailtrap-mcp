import { z } from "zod";

const createSuppressionSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "Email address to suppress.",
    },
    domain_id: {
      type: "integer",
      minimum: 1,
      description:
        "ID of the sending domain the suppression applies to, as returned by the Sending Domains tools.",
    },
    sending_stream: {
      type: "string",
      enum: ["transactional", "bulk"],
      description: "Sending stream to suppress the address for.",
    },
    type: {
      type: "string",
      enum: [
        "hard bounce",
        "spam complaint",
        "unsubscription",
        "manual import",
      ],
      description:
        "Reason recorded for the suppression. Defaults to `manual import` when omitted.",
    },
  },
  required: ["email", "domain_id", "sending_stream"],
  additionalProperties: false,
};

export const createSuppressionZod = z
  .object({
    email: z.string().min(1),
    domain_id: z.number().int().min(1),
    sending_stream: z.enum(["transactional", "bulk"]),
    type: z
      .enum([
        "hard bounce",
        "spam complaint",
        "unsubscription",
        "manual import",
      ])
      .optional(),
  })
  .strict();

export default createSuppressionSchema;
