import { z } from "zod";

const deleteSubAccountSchema = {
  type: "object",
  properties: {
    sub_account_id: {
      type: "number",
      description: "ID of the sub-account to delete.",
    },
  },
  required: ["sub_account_id"],
  additionalProperties: false,
};

export const deleteSubAccountZod = z
  .object({
    sub_account_id: z.number().int().positive(),
  })
  .strict();

export default deleteSubAccountSchema;
