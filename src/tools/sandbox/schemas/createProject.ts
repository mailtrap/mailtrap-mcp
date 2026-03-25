const createProjectSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Name of the project (2–100 characters)",
      minLength: 2,
      maxLength: 100,
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export default createProjectSchema;
