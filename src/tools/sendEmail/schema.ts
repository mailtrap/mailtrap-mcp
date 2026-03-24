const sendEmailSchema = {
  type: "object",
  properties: {
    from: {
      type: "string",
      format: "email",
      description:
        "Sender email address. Optional if DEFAULT_FROM_EMAIL env var is set.",
    },
    to: {
      oneOf: [
        {
          type: "string",
          format: "email",
          description: "Single email address",
        },
        {
          type: "array",
          items: {
            type: "string",
            format: "email",
          },
          description: "Array of email addresses",
        },
      ],
      description:
        "Email address(es) of the recipient(s) - can be a single email or array of emails",
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
      description: "Email category for tracking",
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
  required: ["to", "subject", "category"],
  additionalProperties: false,
};

export default sendEmailSchema;
