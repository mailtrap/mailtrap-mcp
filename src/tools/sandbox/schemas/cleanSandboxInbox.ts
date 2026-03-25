const cleanSandboxInboxSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description:
        "ID of the sandbox inbox to clean (delete all messages from)",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export default cleanSandboxInboxSchema;
