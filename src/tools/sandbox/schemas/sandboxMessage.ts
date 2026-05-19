/**
 * Shared input schema for message-scoped sandbox tools that take only
 * `sandbox_id` (optional, env fallback) and `message_id`.
 * Used by: delete, spam-score, html-analysis, headers, html, text, raw, eml,
 * html-source, list-attachments.
 */
const sandboxMessageSchema = {
  type: "object",
  properties: {
    sandbox_id: {
      type: "number",
      description:
        "Sandbox ID. Falls back to MAILTRAP_SANDBOX_ID env var if omitted.",
    },
    message_id: {
      type: "number",
      description: "ID of the sandbox message",
    },
  },
  required: ["message_id"],
  additionalProperties: false,
};

export default sandboxMessageSchema;
