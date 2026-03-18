import { z } from "zod";

const getSendingStatsSchema = {
  type: "object",
  properties: {
    start_date: {
      type: "string",
      description: "Start date for the stats range (YYYY-MM-DD)",
      example: "2025-01-01",
    },
    end_date: {
      type: "string",
      description: "End date for the stats range (YYYY-MM-DD)",
      example: "2025-01-31",
    },
    breakdown: {
      type: "string",
      enum: [
        "aggregated",
        "by_domain",
        "by_category",
        "by_email_service_provider",
        "by_date",
      ],
      description:
        "How to break down the stats: aggregated (default), by_domain, by_category, by_email_service_provider, or by_date",
      default: "aggregated",
    },
    sending_domain_ids: {
      type: "array",
      items: { type: "integer" },
      description: "Optional filter: limit to these sending domain IDs",
    },
    sending_streams: {
      type: "array",
      items: {
        type: "string",
        enum: ["transactional", "bulk"],
      },
      description: "Optional filter: limit to transactional and/or bulk stream",
    },
    categories: {
      type: "array",
      items: { type: "string" },
      description: "Optional filter: limit to these email categories",
    },
    email_service_providers: {
      type: "array",
      items: { type: "string" },
      description:
        "Optional filter: limit to these email service providers (e.g. Google, Yahoo, Outlook)",
    },
  },
  required: ["start_date", "end_date"],
  additionalProperties: false,
};

export const getSendingStatsZod = z
  .object({
    start_date: z.string(),
    end_date: z.string(),
    breakdown: z
      .enum([
        "aggregated",
        "by_domain",
        "by_category",
        "by_email_service_provider",
        "by_date",
      ])
      .optional()
      .default("aggregated"),
    sending_domain_ids: z.array(z.number().int()).optional(),
    sending_streams: z.array(z.enum(["transactional", "bulk"])).optional(),
    categories: z.array(z.string()).optional(),
    email_service_providers: z.array(z.string()).optional(),
  })
  .strict();

export default getSendingStatsSchema;
