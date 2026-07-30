import { z } from "zod";

const createEmailCampaignSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Campaign name.",
    },
    domain_id: {
      type: "integer",
      minimum: 1,
      description:
        "ID of the verified sending domain used for the campaign, as returned by the Sending Domains endpoints.",
    },
    from_local_part: {
      type: "string",
      description: "Local part (before the @) of the From address.",
    },
    from_display_name: {
      type: "string",
      description: "Display name shown in the From header.",
    },
    reply_to: {
      type: "object",
      description: "Reply-To address parts.",
      properties: {
        display_name: {
          type: "string",
          description: "Reply-To display name.",
        },
        local_part: {
          type: "string",
          description: "Local part (before the @) of the Reply-To address.",
        },
        domain: {
          type: "string",
          description: "Domain of the Reply-To address.",
        },
      },
      additionalProperties: false,
    },
    template_attributes: {
      type: "object",
      description: "Inline email template — the campaign's subject and design.",
      properties: {
        subject: {
          type: "string",
          description:
            "Email subject line (max 255 chars). Required when creating a campaign. Supports merge tags, e.g. `Hi {{first_name}}`.",
        },
        body_html: {
          type: "string",
          description:
            "HTML body of the email (the design). Optional for a draft; required before the campaign can be scheduled or started. Include an unsubscribe link via an anchor whose `href` contains the `__unsubscribe_url__` placeholder. Supports `{{tag_name}}` merge tags.",
        },
        body_text: {
          type: "string",
          description:
            "Optional plain-text alternative of the email body. Supports the same `__unsubscribe_url__` placeholder and `{{tag_name}}` merge tags as `body_html`.",
        },
        merge_tags: {
          type: "array",
          items: { type: "string" },
          description:
            'Bare names of the merge tags referenced in the subject/body, without the `{{ }}` delimiters — e.g. `["first_name"]`.',
        },
      },
      required: ["subject"],
      additionalProperties: false,
    },
    delivery_mode: {
      type: "string",
      enum: ["rapid", "gradual"],
      description:
        "How the campaign is delivered. `rapid` sends as fast as possible; `gradual` throttles sending to `delivery_options.emails_per_hour`.",
    },
    delivery_options: {
      type: "object",
      description:
        "Delivery throttling options. Applies when `delivery_mode` is `gradual`.",
      properties: {
        emails_per_hour: {
          type: ["integer", "null"],
          description: "Maximum number of emails sent per hour.",
        },
      },
      additionalProperties: false,
    },
    contact_list_ids: {
      type: "array",
      items: { type: "integer" },
      description:
        "IDs of contact lists to send to. Treated as the full set of included lists. Combine with `contact_segment_ids` to target both.",
    },
    contact_segment_ids: {
      type: "array",
      items: { type: "integer" },
      description:
        "IDs of contact segments to send to. Treated as the full set of included segments.",
    },
  },
  required: ["name", "domain_id", "from_local_part", "template_attributes"],
  additionalProperties: false,
};

const replyToZod = z
  .object({
    display_name: z.string().optional(),
    local_part: z.string().optional(),
    domain: z.string().optional(),
  })
  .strict();

const deliveryOptionsZod = z
  .object({
    emails_per_hour: z.number().int().nullable().optional(),
  })
  .strict();

export const createEmailCampaignZod = z
  .object({
    name: z.string(),
    domain_id: z.number().int().min(1),
    from_local_part: z.string(),
    from_display_name: z.string().optional(),
    reply_to: replyToZod.optional(),
    template_attributes: z
      .object({
        subject: z.string(),
        body_html: z.string().optional(),
        body_text: z.string().optional(),
        merge_tags: z.array(z.string()).optional(),
      })
      .strict(),
    delivery_mode: z.enum(["rapid", "gradual"]).optional(),
    delivery_options: deliveryOptionsZod.optional(),
    contact_list_ids: z.array(z.number().int()).optional(),
    contact_segment_ids: z.array(z.number().int()).optional(),
  })
  .strict();

export default createEmailCampaignSchema;
