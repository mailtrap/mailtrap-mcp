const updateWebhookSchema = {
  type: "object",
  properties: {
    webhook_id: {
      type: "number",
      description: "ID of the webhook to update",
    },
    url: {
      type: "string",
      description: "New URL that Mailtrap will POST webhook events to.",
    },
    active: {
      type: "boolean",
      description: "Enable or disable the webhook.",
    },
    payload_format: {
      type: "string",
      enum: ["json", "jsonlines"],
      description: "Payload encoding.",
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
  },
  required: ["webhook_id"],
  additionalProperties: false,
};

export default updateWebhookSchema;
