const getWebhookSchema = {
  type: "object",
  properties: {
    webhook_id: {
      type: "number",
      description: "ID of the webhook to fetch",
    },
  },
  required: ["webhook_id"],
  additionalProperties: false,
};

export default getWebhookSchema;
