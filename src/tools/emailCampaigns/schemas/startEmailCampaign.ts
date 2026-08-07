const startEmailCampaignSchema = {
  type: "object",
  properties: {
    email_campaign_id: {
      type: "integer",
      minimum: 1,
      description: "Unique identifier of the email campaign to start.",
    },
  },
  required: ["email_campaign_id"],
  additionalProperties: false,
};

export default startEmailCampaignSchema;
