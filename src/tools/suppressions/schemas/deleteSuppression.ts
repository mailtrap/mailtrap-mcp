const deleteSuppressionSchema = {
  type: "object",
  properties: {
    suppression_id: {
      type: "string",
      description: "ID of the suppression to delete",
    },
  },
  required: ["suppression_id"],
  additionalProperties: false,
};

export default deleteSuppressionSchema;
