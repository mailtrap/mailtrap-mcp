const createSandboxInboxSchema = {
  type: "object",
  properties: {
    project_id: {
      type: "number",
      description: "ID of the project to create the inbox in",
    },
    name: {
      type: "string",
      description: "Name of the inbox",
    },
  },
  required: ["project_id", "name"],
  additionalProperties: false,
};

export default createSandboxInboxSchema;
