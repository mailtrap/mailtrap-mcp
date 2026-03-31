import mailtrapAddressParamSchema from "../schemas/mailtrapAddressParam";

const sendEmailSchema = {
  type: "object",
  properties: {
    from: {
      ...mailtrapAddressParamSchema,
      description:
        "Sender as an email string or `{ email, name? }` for a display name. Omit if DEFAULT_FROM_EMAIL is set.",
    },
    to: {
      oneOf: [
        mailtrapAddressParamSchema,
        {
          type: "array",
          minItems: 1,
          items: mailtrapAddressParamSchema,
        },
      ],
      description:
        "Recipient(s): one address (string or `{ email, name? }`) or a non-empty array of those.",
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
