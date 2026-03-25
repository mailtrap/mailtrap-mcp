const deleteProjectSchema = {
  type: "object",
  properties: {
    project_id: {
      type: "number",
      description: "ID of the project to delete",
    },
  },
  required: ["project_id"],
  additionalProperties: false,
};

export default deleteProjectSchema;
