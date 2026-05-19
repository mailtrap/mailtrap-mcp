const deleteContactFieldSchema = {
  type: "object",
  properties: {
    field_id: {
      type: "number",
      description: "ID of the contact field to delete.",
    },
  },
  required: ["field_id"],
  additionalProperties: false,
};

export default deleteContactFieldSchema;
