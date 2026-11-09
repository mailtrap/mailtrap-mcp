const createSandboxSchema = {
  type: "object",
  properties: {
    project_id: {
      type: "number",
      description: "ID of the project to create the sandbox in",
    },
    name: {
      type: "string",
      description: "Name of the sandbox",
    },
  },
  required: ["project_id", "name"],
  additionalProperties: false,
};

export default createSandboxSchema;
