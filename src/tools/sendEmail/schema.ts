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
        "Recipient(s): one address (string or `{ email, name? }`) or a non-empty array of those. Optional if `cc` or `bcc` is provided; at least one of `to`/`cc`/`bcc` must contain a recipient.",
    },
    subject: {
      type: "string",
      description:
        "Email subject line. Required for inline (text/html) sends; must be omitted when `template_uuid` is set.",
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
      description:
        "Optional email category for tracking. Must be omitted when `template_uuid` is set.",
    },
    text: {
      type: "string",
      description:
        "Email body text. Required (alongside or instead of `html`) for inline sends; must be omitted when `template_uuid` is set.",
    },
    html: {
      type: "string",
      description:
        "Optional HTML version of the email body. Must be omitted when `template_uuid` is set.",
    },
    template_uuid: {
      type: "string",
      description:
        "Use a Mailtrap email template instead of inline content. When set, `subject`, `text`, `html`, and `category` must be omitted (per Mailtrap API).",
    },
    template_variables: {
      type: "object",
      additionalProperties: true,
      description:
        "Variables substituted into the template referenced by `template_uuid`. Only allowed together with `template_uuid`; rejected otherwise.",
    },
  },
  required: [],
  additionalProperties: false,
};

export default sendEmailSchema;
