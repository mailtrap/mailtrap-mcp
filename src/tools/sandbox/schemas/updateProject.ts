const updateProjectSchema = {
  type: "object",
  properties: {
    project_id: {
      type: "number",
      description: "ID of the project to update",
    },
    name: {
      type: "string",
      description: "New name for the project (2–100 characters)",
      minLength: 2,
      maxLength: 100,
    },
  },
  required: ["project_id", "name"],
  additionalProperties: false,
};

export default updateProjectSchema;
