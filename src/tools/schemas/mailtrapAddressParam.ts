/**
 * JSON Schema fragments for Mailtrap address fields.
 *
 * Deliberately combinator-free: some MCP clients (e.g. Claude Desktop) strip
 * `oneOf`/`anyOf` from property schemas, leaving an empty `{}` schema and
 * causing arguments to arrive corrupted (JSON-stringified). Handlers still
 * accept a bare email string at runtime via the address normalizers.
 */
const mailtrapAddressParamSchema = {
  type: "object",
  description:
    "Address with optional display name (a bare email string is also accepted)",
  properties: {
    email: {
      type: "string",
      format: "email",
      description: "Email address",
    },
    name: {
      type: "string",
      description: "Display name for this address",
    },
  },
  required: ["email"],
  additionalProperties: false,
};

/**
 * Shared fragment for recipient-list properties (`to` in the send tools):
 * a non-empty array of address objects. Spread and override `description`
 * where a tool accepts extra forms (e.g. the sandbox comma-separated string).
 */
export const mailtrapAddressListParamSchema = {
  type: "array",
  minItems: 1,
  items: mailtrapAddressParamSchema,
  description:
    "Recipients as an array of `{ email, name? }` objects (bare email strings are also accepted as items). Optional if `cc` or `bcc` is provided; at least one of `to`/`cc`/`bcc` must contain a recipient.",
};

/** Shared fragment for `from` properties in the send tools. */
export const mailtrapFromParamSchema = {
  ...mailtrapAddressParamSchema,
  description:
    "Sender as `{ email, name? }` (a bare email string is also accepted). Omit if `DEFAULT_FROM_EMAIL` is set.",
};

const optionalRecipientListSchema = (kind: "CC" | "BCC") => ({
  type: "array",
  items: mailtrapAddressParamSchema,
  description: `Optional ${kind} recipients as \`{ email, name? }\` objects (bare email strings also accepted)`,
});

/** Shared fragments for `cc`/`bcc` properties in the send tools. */
export const mailtrapCcParamSchema = optionalRecipientListSchema("CC");
export const mailtrapBccParamSchema = optionalRecipientListSchema("BCC");

export default mailtrapAddressParamSchema;
