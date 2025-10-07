const sendSandboxEmailSchema = {
  type: "object",
  properties: {
    from: {
      type: "string",
      format: "email",
      description: "Email address of the sender",
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
  required: ["from", "to", "subject"],
  additionalProperties: false,
};

export default sendSandboxEmailSchema;
