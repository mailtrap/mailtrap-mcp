const createWebhookSchema = {
  type: "object",
  properties: {
    url: {
      type: "string",
      description: "URL that Mailtrap will POST webhook events to.",
    },
    webhook_type: {
      type: "string",
      enum: ["email_sending", "audit_log", "inbound_receiving"],
      description:
        "Webhook category. `email_sending` for delivery/open/click/etc events, `audit_log` for account audit events, `inbound_receiving` for inbound inbox events.",
    },
    active: {
      type: "boolean",
      description: "Whether the webhook is enabled. Defaults to true.",
    },
    payload_format: {
      type: "string",
      enum: ["json", "jsonlines"],
      description: "Payload encoding. Defaults to `json`.",
    },
    sending_stream: {
      type: "string",
      enum: ["transactional", "bulk"],
      description:
        "Sending stream this webhook subscribes to. Applies only to `email_sending` webhooks.",
    },
    event_types: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "delivery",
          "soft_bounce",
          "bounce",
          "suspension",
          "unsubscribe",
          "open",
          "spam_complaint",
          "click",
          "reject",
        ],
      },
      description:
        "Events to subscribe to. Applies only to `email_sending` webhooks.",
    },
    domain_id: {
      type: "number",
      description:
        "Sending domain ID to scope this webhook to. Applies only to `email_sending` webhooks.",
    },
    inbound_inbox_id: {
      type: "number",
      description:
        "ID of the inbound inbox the webhook is linked to. Applicable only for `inbound_receiving` webhooks; optional — omit to apply to all inboxes in the account.",
    },
  },
  required: ["url", "webhook_type"],
  additionalProperties: false,
};

export default createWebhookSchema;
