import mailtrapAddressParamSchema from "../schemas/mailtrapAddressParam";
import attachmentParamSchema from "../schemas/attachmentParam";

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
    attachments: {
      type: "array",
      minItems: 1,
      items: attachmentParamSchema,
      description:
        "Optional attachments. Each entry must include base64 `content` and `filename`. " +
        "Set `disposition: 'inline'` plus `content_id` to embed images referenced from HTML " +
        'as `<img src="cid:{content_id}">`; otherwise the file is delivered as a download. ' +
        "Size limits: 10 MB per attachment and 15 MB total by default; executable filename " +
        "extensions are rejected.",
    },
  },
  required: ["to", "subject", "category"],
  additionalProperties: false,
};

export default sendEmailSchema;
