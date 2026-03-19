const showEmailMessageSchema = {
  type: "object",
  properties: {
    message_id: {
      type: "number",
      description: "ID of the sandbox email message to retrieve",
    },
    include_spam_report: {
      type: "boolean",
      description:
        "When true, include spam report (SpamAssassin score and details). Critical for deliverability testing.",
      default: false,
    },
    include_html_analysis: {
      type: "boolean",
      description:
        "When true, include HTML analysis (client compatibility, problematic elements). Critical for email client testing.",
      default: false,
    },
  },
  required: ["message_id"],
  additionalProperties: false,
};

export default showEmailMessageSchema;
