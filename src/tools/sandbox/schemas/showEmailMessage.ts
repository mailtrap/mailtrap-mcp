const showEmailMessageSchema = {
  type: "object",
  properties: {
    test_inbox_id: {
      type: "number",
      description:
        "Mailtrap test inbox ID. Optional if MAILTRAP_TEST_INBOX_ID env var is set. Use to target a specific inbox.",
    },
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
