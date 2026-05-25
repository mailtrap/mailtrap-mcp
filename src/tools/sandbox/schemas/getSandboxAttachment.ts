const getSandboxAttachmentSchema = {
  type: "object",
  properties: {
    sandbox_id: {
      type: "number",
      description:
        "Sandbox ID. Falls back to MAILTRAP_SANDBOX_ID env var if omitted.",
    },
    message_id: {
      type: "number",
      description: "ID of the sandbox message that contains the attachment",
    },
    attachment_id: {
      type: "number",
      description: "ID of the attachment to fetch",
    },
  },
  required: ["message_id", "attachment_id"],
  additionalProperties: false,
};

export default getSandboxAttachmentSchema;
