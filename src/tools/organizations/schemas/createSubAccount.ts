const createSubAccountSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Display name for the new sub-account.",
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export default createSubAccountSchema;
