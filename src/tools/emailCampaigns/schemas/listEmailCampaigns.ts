import { z } from "zod";

const listEmailCampaignsSchema = {
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
      description: "Number of campaigns per page. Defaults to 50, maximum 100.",
    },
    search: {
      type: "string",
      description:
        'Filter campaigns by name (case-insensitive partial match), e.g. "spring".',
    },
  },
  required: [],
  additionalProperties: false,
};

export const listEmailCampaignsZod = z
  .object({
    token: z.number().int().min(1).optional(),
    per_page: z.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
  })
  .strict();

export default listEmailCampaignsSchema;
