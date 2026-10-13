import { z } from "zod";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SOURCES = ["campaigns", "automations"] as const;

const dateZod = z.string().regex(DATE_PATTERN, "must be in YYYY-MM-DD format");

const getMarketingStatsSchema = {
  type: "object",
  properties: {
    start_date: {
      type: "string",
      pattern: DATE_PATTERN.source,
      description:
        "Start of the date range (inclusive), in `YYYY-MM-DD` format.",
    },
    end_date: {
      type: "string",
      pattern: DATE_PATTERN.source,
      description: "End of the date range (inclusive), in `YYYY-MM-DD` format.",
    },
    sending_domain_ids: {
      type: "array",
      items: { type: "integer" },
      description:
        "Optional filter: limit to these sending domain IDs, as returned by list-sending-domains.",
    },
    sources: {
      type: "array",
      items: {
        type: "string",
        enum: SOURCES,
      },
      description:
        "Optional filter: `campaigns` or `automations` narrows the stats to that source; omit it, or pass both, for all Email Marketing traffic.",
    },
    email_service_providers: {
      type: "array",
      items: { type: "string" },
      description:
        "Optional filter: limit to these email service providers (e.g. Google, Yahoo, Outlook).",
    },
  },
  required: ["start_date", "end_date"],
  additionalProperties: false,
};

export const getMarketingStatsZod = z
  .object({
    start_date: dateZod,
    end_date: dateZod,
    sending_domain_ids: z.array(z.number().int()).optional(),
    sources: z.array(z.enum(SOURCES)).optional(),
    email_service_providers: z.array(z.string()).optional(),
  })
  .strict();

export default getMarketingStatsSchema;
