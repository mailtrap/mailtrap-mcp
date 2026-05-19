const deleteWebhookSchema = {
  type: "object",
  properties: {
    webhook_id: {
      type: "number",
      description: "ID of the webhook to delete",
    },
  },
  required: ["webhook_id"],
  additionalProperties: false,
};

export default deleteWebhookSchema;
