const deleteSandboxInboxSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description: "ID of the sandbox inbox to delete",
    },
  },
  required: ["inbox_id"],
  additionalProperties: false,
};

export default deleteSandboxInboxSchema;
