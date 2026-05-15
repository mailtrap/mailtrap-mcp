const getProjectSchema = {
  type: "object",
  properties: {
    project_id: {
      type: "number",
      description: "ID of the project to fetch",
    },
  },
  required: ["project_id"],
  additionalProperties: false,
};

export default getProjectSchema;
