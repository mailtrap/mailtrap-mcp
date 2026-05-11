/**
 * Shared JSON Schema fragment for a single attachment in send-email and
 * send-sandbox-email. Mirrors Mailtrap's public REST API field names so the
 * shape matches the docs at https://api-docs.mailtrap.io/.
 */
const attachmentParamSchema = {
  type: "object",
  properties: {
    content: {
      type: "string",
      minLength: 1,
      description:
        "Base64-encoded file content (no whitespace, standard padding). " +
        "Files are never read from disk by this tool — encode the bytes yourself before passing.",
    },
    filename: {
      type: "string",
      minLength: 1,
      description: "Filename shown to the recipient (e.g. 'report.pdf').",
    },
    type: {
      type: "string",
      description:
        "MIME type (e.g. 'image/png', 'application/pdf'). Defaults to 'application/octet-stream' if omitted.",
    },
    disposition: {
      type: "string",
      enum: ["attachment", "inline"],
      description:
        "'attachment' (default) shows as a downloadable file. 'inline' embeds the content " +
        "in the HTML body via 'cid:' references — requires 'content_id'.",
    },
    content_id: {
      type: "string",
      description:
        "Required when disposition is 'inline'. Referenced from the HTML body as " +
        '<img src="cid:{content_id}">. Letters, digits, ".", "_", "-" only.',
    },
  },
  required: ["content", "filename"],
  additionalProperties: false,
} as const;

export default attachmentParamSchema;
