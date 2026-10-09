import { z } from "zod";

const listTemplatesSchema = {
  type: "object",
  properties: {
    token: {
      type: "integer",
      minimum: 1,
      description:
        "Page number to retrieve (page-token pagination). Defaults to `1`.",
    },
    per_page: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      description:
        "Number of templates per page. Defaults to 50, maximum 100. Pass the same value on every page.",
    },
  },
  required: [],
  additionalProperties: false,
};

export const listTemplatesZod = z
  .object({
    token: z.number().int().min(1).optional(),
    per_page: z.number().int().min(1).max(100).optional(),
  })
  .strict();

export default listTemplatesSchema;
