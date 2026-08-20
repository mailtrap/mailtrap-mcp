import { z } from "zod";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getEmailCampaignStatsSchema = {
  type: "object",
  properties: {
    email_campaign_id: {
      type: "integer",
      minimum: 1,
      description: "Unique identifier of the email campaign.",
    },
    start_date: {
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      description:
        "Start of the aggregation window (inclusive), in `YYYY-MM-DD` format. Defaults to the day the campaign was last started.",
    },
    end_date: {
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      description:
        "End of the aggregation window (inclusive), in `YYYY-MM-DD` format. Defaults to the current date.",
    },
  },
  required: ["email_campaign_id"],
  additionalProperties: false,
};

export const getEmailCampaignStatsZod = z
  .object({
    email_campaign_id: z.number().int().min(1),
    start_date: z
      .string()
      .regex(DATE_PATTERN, "must be in YYYY-MM-DD format")
      .optional(),
    end_date: z
      .string()
      .regex(DATE_PATTERN, "must be in YYYY-MM-DD format")
      .optional(),
  })
  .strict();

export default getEmailCampaignStatsSchema;
