const updateSandboxInboxSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "ID of the sandbox inbox to update",
    },
    name: {
      type: "string",
      description: "New name for the inbox",
    },
    email_username: {
      type: "string",
      description: "New email username for the inbox",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export default updateSandboxInboxSchema;
