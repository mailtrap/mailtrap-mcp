const forwardSandboxMessageSchema = {
  type: "object",
  properties: {
    sandbox_id: {
      type: "number",
      description:
        "Sandbox ID. Falls back to MAILTRAP_SANDBOX_ID env var if omitted.",
    },
    message_id: {
      type: "number",
      description: "ID of the sandbox message to forward",
    },
    email: {
      type: "string",
      description: "Email address to forward the message to",
      format: "email",
    },
  },
  required: ["message_id", "email"],
  additionalProperties: false,
};

export default forwardSandboxMessageSchema;
