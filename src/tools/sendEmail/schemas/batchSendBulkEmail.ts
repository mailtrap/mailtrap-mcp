import mailtrapAddressParamSchema from "../../schemas/mailtrapAddressParam";

const addressArrayOrSingle = {
  oneOf: [
    mailtrapAddressParamSchema,
    {
      type: "array",
      minItems: 1,
      items: mailtrapAddressParamSchema,
    },
  ],
};

const inlineOrTemplateProps = {
  subject: {
    type: "string",
    description:
      "Email subject. Required for inline sends; omit when using `template_uuid`.",
  },
  text: {
    type: "string",
    description:
      "Email body text. Required for inline sends; omit when using `template_uuid`.",
  },
  html: {
    type: "string",
    description: "Optional HTML body. Omit when using `template_uuid`.",
  },
  category: {
    type: "string",
    description: "Optional category. Omit when using `template_uuid`.",
  },
  template_uuid: {
    type: "string",
    description:
      "Use a Mailtrap template instead of inline content. Mutually exclusive with `subject`/`text`/`html`/`category`.",
  },
  template_variables: {
    type: "object",
    additionalProperties: true,
    description:
      "Variables for the referenced template. Only allowed together with `template_uuid`.",
  },
  custom_variables: {
    type: "object",
    additionalProperties: { type: "string" },
    description: "Optional custom variables (string-valued).",
  },
  headers: {
    type: "object",
    additionalProperties: { type: "string" },
    description: "Optional custom email headers (string-valued).",
  },
};

const batchSendBulkEmailSchema = {
  type: "object",
  properties: {
    base: {
      type: "object",
      description:
        "Shared fields applied to every request in the batch. Each request can override individual fields.",
      properties: {
        from: {
          ...mailtrapAddressParamSchema,
          description:
            "Sender as an email string or `{ email, name? }`. Omit if `DEFAULT_FROM_EMAIL` is set.",
        },
        reply_to: {
          ...mailtrapAddressParamSchema,
          description: "Optional reply-to address.",
        },
        ...inlineOrTemplateProps,
      },
      additionalProperties: false,
    },
    requests: {
      type: "array",
      minItems: 1,
      description:
        "Per-recipient messages. Each request must include at least one recipient via `to`, `cc`, or `bcc`; other fields override `base`.",
      items: {
        type: "object",
        properties: {
          to: {
            ...addressArrayOrSingle,
            description:
              "Recipient(s): one address (string or `{ email, name? }`) or a non-empty array. Optional if `cc` or `bcc` is provided; at least one of `to`/`cc`/`bcc` must contain a recipient.",
          },
          cc: {
            type: "array",
            items: mailtrapAddressParamSchema,
            description: "Optional CC recipients.",
          },
          bcc: {
            type: "array",
            items: mailtrapAddressParamSchema,
            description: "Optional BCC recipients.",
          },
          reply_to: {
            ...mailtrapAddressParamSchema,
            description: "Optional reply-to override for this request.",
          },
          ...inlineOrTemplateProps,
        },
        additionalProperties: false,
      },
    },
  },
  required: ["requests"],
  additionalProperties: false,
};

export default batchSendBulkEmailSchema;
