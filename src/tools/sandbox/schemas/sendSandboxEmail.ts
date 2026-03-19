const sendSandboxEmailSchema = {
  type: "object",
  properties: {
    test_inbox_id: {
      type: "number",
      description:
        "Mailtrap test inbox ID. Optional if MAILTRAP_TEST_INBOX_ID env var is set. Use to target a specific inbox.",
    },
    from: {
      type: "string",
      format: "email",
      description:
        "Sender email address. Optional if DEFAULT_FROM_EMAIL env var is set.",
    },
    to: {
      type: "string",
      minLength: 1,
      description: "Email addresses (comma-separated or single)",
    },
    subject: {
      type: "string",
      description: "Email subject line",
    },
    cc: {
      type: "array",
      items: {
        type: "string",
        format: "email",
      },
      description: "Optional CC recipients",
    },
    bcc: {
      type: "array",
      items: {
        type: "string",
        format: "email",
      },
      description: "Optional BCC recipients",
    },
    category: {
      type: "string",
      description: "Optional email category for tracking",
    },
    text: {
      type: "string",
      description: "Email body text",
    },
    html: {
      type: "string",
      description: "Optional HTML version of the email body",
    },
  },
  required: ["to", "subject"],
  additionalProperties: false,
};

export default sendSandboxEmailSchema;
