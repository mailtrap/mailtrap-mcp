import { z } from "zod";

const removeAccountAccessSchema = {
  type: "object",
  properties: {
    account_access_id: {
      type: "number",
      description: "ID of the account access to remove.",
    },
  },
  required: ["account_access_id"],
  additionalProperties: false,
};

export const removeAccountAccessZod = z
  .object({
    account_access_id: z.number().int().positive(),
  })
  .strict();

export default removeAccountAccessSchema;
