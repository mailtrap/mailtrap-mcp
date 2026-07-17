import {
  mailtrapAddressListParamSchema,
  mailtrapBccParamSchema,
  mailtrapCcParamSchema,
  mailtrapFromParamSchema,
} from "../../schemas/mailtrapAddressParam";

const sendSandboxEmailSchema = {
  type: "object",
  properties: {
    test_inbox_id: {
      type: "number",
      description:
        "Mailtrap test inbox ID. Optional if MAILTRAP_TEST_INBOX_ID env var is set. Use to target a specific inbox.",
    },
    from: mailtrapFromParamSchema,
    to: {
      ...mailtrapAddressListParamSchema,
      description:
        "Recipients as an array of `{ email, name? }` objects (bare email strings as items, or a comma-separated string of plain emails, are also accepted). Optional if `cc` or `bcc` is provided; at least one of `to`/`cc`/`bcc` must contain a recipient.",
    },
    subject: {
      type: "string",
      description:
        "Email subject line. Required for inline (text/html) sends; must be omitted when `template_uuid` is set.",
    },
    cc: mailtrapCcParamSchema,
    bcc: mailtrapBccParamSchema,
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

export default sendSandboxEmailSchema;
