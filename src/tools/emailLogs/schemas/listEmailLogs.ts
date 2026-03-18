import { z } from "zod";

const stringOrStringArray = z.union([z.string(), z.array(z.string())]);

const listEmailLogsSchema = {
  type: "object",
  properties: {
    search_after: {
      type: "string",
      description:
        "Pagination cursor from the previous response's next_page_cursor to fetch the next page",
    },
    sent_after: {
      type: "string",
      description:
        "ISO 8601 date/time; only return logs for emails sent after this time",
    },
    sent_before: {
      type: "string",
      description:
        "ISO 8601 date/time; only return logs for emails sent before this time",
    },
    from_email: {
      oneOf: [
        { type: "string", description: "Single sender email" },
        {
          type: "array",
          items: { type: "string" },
          description: "Multiple sender emails (match any)",
        },
      ],
      description:
        "Filter by sender email (use with from_operator). Single value or array.",
    },
    from_operator: {
      type: "string",
      enum: ["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"],
      description:
        "Operator for from_email filter. Default: ci_equal. ci_contain/ci_not_contain match substring; ci_equal/ci_not_equal match exactly (case-insensitive).",
    },
    to_email: {
      oneOf: [
        { type: "string", description: "Single recipient email" },
        {
          type: "array",
          items: { type: "string" },
          description: "Multiple recipient emails (match any)",
        },
      ],
      description:
        "Filter by recipient email (use with to_operator). Single value or array.",
    },
    to_operator: {
      type: "string",
      enum: ["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"],
      description: "Operator for to_email filter. Default: ci_equal.",
    },
    status: {
      oneOf: [
        {
          type: "string",
          enum: ["delivered", "not_delivered", "enqueued", "opted_out"],
        },
        {
          type: "array",
          items: {
            type: "string",
            enum: ["delivered", "not_delivered", "enqueued", "opted_out"],
          },
        },
      ],
      description:
        "Filter by delivery status (use with status_operator). Single value or array.",
    },
    status_operator: {
      type: "string",
      enum: ["equal", "not_equal"],
      description: "Operator for status filter. Default: equal.",
    },
    subject: {
      oneOf: [
        { type: "string", description: "Single subject pattern" },
        {
          type: "array",
          items: { type: "string" },
          description: "Multiple subject patterns (match any)",
        },
      ],
      description:
        "Filter by email subject (use with subject_operator). Single value or array. Omit for empty/not_empty.",
    },
    subject_operator: {
      type: "string",
      enum: [
        "ci_contain",
        "ci_not_contain",
        "ci_equal",
        "ci_not_equal",
        "empty",
        "not_empty",
      ],
      description:
        "Operator for subject filter. Default: ci_contain. Use empty/not_empty to filter by presence of subject.",
    },
    sending_domain_id: {
      oneOf: [
        { type: "number", description: "Single sending domain ID" },
        {
          type: "array",
          items: { type: "number" },
          description: "Multiple sending domain IDs (match any)",
        },
      ],
      description:
        "Filter by sending domain ID. Single value or array. Find IDs in Mailtrap Sending Domains.",
    },
    sending_domain_id_operator: {
      type: "string",
      enum: ["equal", "not_equal"],
      description: "Operator for sending_domain_id filter. Default: equal.",
    },
    sending_stream: {
      oneOf: [
        {
          type: "string",
          enum: ["transactional", "bulk"],
        },
        {
          type: "array",
          items: {
            type: "string",
            enum: ["transactional", "bulk"],
          },
        },
      ],
      description:
        "Filter by sending stream: transactional or bulk. Single value or array.",
    },
    sending_stream_operator: {
      type: "string",
      enum: ["equal", "not_equal"],
      description: "Operator for sending_stream filter. Default: equal.",
    },
    events: {
      oneOf: [
        {
          type: "string",
          enum: [
            "delivery",
            "open",
            "click",
            "bounce",
            "spam",
            "unsubscribe",
            "soft_bounce",
            "reject",
            "suspension",
          ],
        },
        {
          type: "array",
          items: {
            type: "string",
            enum: [
              "delivery",
              "open",
              "click",
              "bounce",
              "spam",
              "unsubscribe",
              "soft_bounce",
              "reject",
              "suspension",
            ],
          },
        },
      ],
      description:
        "Filter by event type(s). Use with events_operator: include_event or not_include_event.",
    },
    events_operator: {
      type: "string",
      enum: ["include_event", "not_include_event"],
      description: "Operator for events filter. Default: include_event.",
    },
    clicks_count: {
      type: "number",
      description:
        "Filter by number of link clicks. Use with clicks_count_operator.",
    },
    clicks_count_operator: {
      type: "string",
      enum: ["equal", "greater_than", "less_than"],
      description: "Operator for clicks_count. Default: equal.",
    },
    opens_count: {
      type: "number",
      description: "Filter by number of opens. Use with opens_count_operator.",
    },
    opens_count_operator: {
      type: "string",
      enum: ["equal", "greater_than", "less_than"],
      description: "Operator for opens_count. Default: equal.",
    },
    client_ip: {
      type: "string",
      description: "Filter by client IP. Use with client_ip_operator.",
    },
    client_ip_operator: {
      type: "string",
      enum: ["equal", "not_equal", "contain", "not_contain"],
      description: "Operator for client_ip. Default: equal.",
    },
    sending_ip: {
      type: "string",
      description: "Filter by sending IP. Use with sending_ip_operator.",
    },
    sending_ip_operator: {
      type: "string",
      enum: ["equal", "not_equal", "contain", "not_contain"],
      description: "Operator for sending_ip. Default: equal.",
    },
    email_service_provider_response: {
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      description:
        "Filter by provider response text. Single value or array. Use with *_operator.",
    },
    email_service_provider_response_operator: {
      type: "string",
      enum: ["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"],
      description:
        "Operator for email_service_provider_response. Default: ci_contain.",
    },
    email_service_provider: {
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      description:
        "Filter by email service provider (exact). Single value or array. Use with *_operator.",
    },
    email_service_provider_operator: {
      type: "string",
      enum: ["equal", "not_equal"],
      description: "Operator for email_service_provider. Default: equal.",
    },
    recipient_mx: {
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      description:
        "Filter by recipient MX. Single value or array. Use with recipient_mx_operator.",
    },
    recipient_mx_operator: {
      type: "string",
      enum: ["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"],
      description: "Operator for recipient_mx. Default: ci_contain.",
    },
    category: {
      oneOf: [
        { type: "string", description: "Single category value." },
        {
          type: "array",
          items: { type: "string" },
          description:
            "Multiple category values (OR). Logs matching any value are returned.",
        },
      ],
      description:
        'Filter by email category. Use with category_operator. Single value, array (e.g. ["Newsletter", "Alert"]), or comma-separated string (e.g. "Newsletter,Alert") for multiple (OR).',
    },
    category_operator: {
      type: "string",
      enum: ["equal", "not_equal"],
      description: "Operator for category. Default: equal.",
    },
  },
  required: [],
  additionalProperties: false,
};

export const listEmailLogsZod = z
  .object({
    search_after: z.string().optional(),
    sent_after: z.string().optional(),
    sent_before: z.string().optional(),
    from_email: stringOrStringArray.optional(),
    from_operator: z
      .enum(["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"])
      .optional(),
    to_email: stringOrStringArray.optional(),
    to_operator: z
      .enum(["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"])
      .optional(),
    status: z
      .union([
        z.enum(["delivered", "not_delivered", "enqueued", "opted_out"]),
        z.array(
          z.enum(["delivered", "not_delivered", "enqueued", "opted_out"])
        ),
      ])
      .optional(),
    status_operator: z.enum(["equal", "not_equal"]).optional(),
    subject: stringOrStringArray.optional(),
    subject_operator: z
      .enum([
        "ci_contain",
        "ci_not_contain",
        "ci_equal",
        "ci_not_equal",
        "empty",
        "not_empty",
      ])
      .optional(),
    sending_domain_id: z.union([z.number(), z.array(z.number())]).optional(),
    sending_domain_id_operator: z.enum(["equal", "not_equal"]).optional(),
    sending_stream: z
      .union([
        z.enum(["transactional", "bulk"]),
        z.array(z.enum(["transactional", "bulk"])),
      ])
      .optional(),
    sending_stream_operator: z.enum(["equal", "not_equal"]).optional(),
    events: z
      .union([
        z.enum([
          "delivery",
          "open",
          "click",
          "bounce",
          "spam",
          "unsubscribe",
          "soft_bounce",
          "reject",
          "suspension",
        ]),
        z.array(
          z.enum([
            "delivery",
            "open",
            "click",
            "bounce",
            "spam",
            "unsubscribe",
            "soft_bounce",
            "reject",
            "suspension",
          ])
        ),
      ])
      .optional(),
    events_operator: z.enum(["include_event", "not_include_event"]).optional(),
    clicks_count: z.number().optional(),
    clicks_count_operator: z
      .enum(["equal", "greater_than", "less_than"])
      .optional(),
    opens_count: z.number().optional(),
    opens_count_operator: z
      .enum(["equal", "greater_than", "less_than"])
      .optional(),
    client_ip: z.string().optional(),
    client_ip_operator: z
      .enum(["equal", "not_equal", "contain", "not_contain"])
      .optional(),
    sending_ip: z.string().optional(),
    sending_ip_operator: z
      .enum(["equal", "not_equal", "contain", "not_contain"])
      .optional(),
    email_service_provider_response: stringOrStringArray.optional(),
    email_service_provider_response_operator: z
      .enum(["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"])
      .optional(),
    email_service_provider: stringOrStringArray.optional(),
    email_service_provider_operator: z.enum(["equal", "not_equal"]).optional(),
    recipient_mx: stringOrStringArray.optional(),
    recipient_mx_operator: z
      .enum(["ci_contain", "ci_not_contain", "ci_equal", "ci_not_equal"])
      .optional(),
    category: stringOrStringArray.optional(),
    category_operator: z.enum(["equal", "not_equal"]).optional(),
  })
  .strict();

/** Runtime validation for client.emailLogs.getList() response. */
export const listEmailLogsResponseZod = z.object({
  messages: z.array(z.record(z.unknown())).optional(),
  total_count: z.number().optional(),
  next_page_cursor: z.string().nullable().optional(),
});

export default listEmailLogsSchema;
