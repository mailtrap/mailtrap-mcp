import mailtrapAddressParamSchema from "../../schemas/mailtrapAddressParam";

const sendSandboxEmailSchema = {
  type: "object",
  properties: {
    test_inbox_id: {
      type: "number",
      description:
        "Mailtrap test inbox ID. Optional if MAILTRAP_TEST_INBOX_ID env var is set. Use to target a specific inbox.",
    },
    from: {
      ...mailtrapAddressParamSchema,
      description:
        "Sender as an email string or `{ email, name? }`. Omit if DEFAULT_FROM_EMAIL is set.",
    },
    to: {
      oneOf: [
        {
          type: "string",
          minLength: 1,
          description:
            "Comma-separated email addresses (plain emails only; use array form for display names).",
        },
        {
          type: "array",
          minItems: 1,
          items: mailtrapAddressParamSchema,
          description:
            "Array of recipients as email strings or `{ email, name? }` objects.",
        },
      ],
      description:
        "Recipients: comma-separated string, or an array of addresses with optional display names.",
    },
    subject: {
      type: "string",
      description: "Email subject line",
    },
    cc: {
      type: "array",
      items: mailtrapAddressParamSchema,
      description: "Optional CC recipients (email or `{ email, name? }` each)",
    },
    bcc: {
      type: "array",
      items: mailtrapAddressParamSchema,
      description: "Optional BCC recipients (email or `{ email, name? }` each)",
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
