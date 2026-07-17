import mailtrapAddressParamSchema, {
  mailtrapAddressListParamSchema,
  mailtrapBccParamSchema,
  mailtrapCcParamSchema,
  mailtrapFromParamSchema,
} from "../../schemas/mailtrapAddressParam";

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

const batchSendStreamEmailSchema = {
  type: "object",
  properties: {
    base: {
      type: "object",
      description:
        "Shared fields applied to every request in the batch. Each request can override individual fields.",
      properties: {
        from: mailtrapFromParamSchema,
        reply_to: {
          ...mailtrapAddressParamSchema,
          description:
            "Optional reply-to address as `{ email, name? }` (a bare email string is also accepted).",
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
          to: mailtrapAddressListParamSchema,
          cc: mailtrapCcParamSchema,
          bcc: mailtrapBccParamSchema,
          reply_to: {
            ...mailtrapAddressParamSchema,
            description:
              "Optional reply-to override for this request as `{ email, name? }` (a bare email string is also accepted).",
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

export default batchSendStreamEmailSchema;
