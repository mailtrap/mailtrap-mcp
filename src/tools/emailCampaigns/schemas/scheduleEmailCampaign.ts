import { z } from "zod";

const scheduleEmailCampaignSchema = {
  type: "object",
  properties: {
    email_campaign_id: {
      type: "integer",
      minimum: 1,
      description: "Unique identifier of the email campaign to schedule.",
    },
    datetime: {
      type: "string",
      description:
        "When to send the campaign (ISO 8601, e.g. `2026-09-01T09:00:00Z` or with a UTC offset). Must be in the future and no more than 1 month ahead, otherwise the request is rejected with `422`.",
    },
  },
  required: ["email_campaign_id", "datetime"],
  additionalProperties: false,
};

function oneMonthFromNow(): Date {
  const limit = new Date();
  limit.setMonth(limit.getMonth() + 1);
  return limit;
}

export const scheduleEmailCampaignZod = z
  .object({
    email_campaign_id: z.number().int().min(1),
    datetime: z
      .string()
      .datetime({ offset: true })
      .refine((value) => new Date(value) > new Date(), {
        message: "must be in the future",
      })
      .refine((value) => new Date(value) <= oneMonthFromNow(), {
        message: "must be no more than 1 month ahead",
      }),
  })
  .strict();

export default scheduleEmailCampaignSchema;
