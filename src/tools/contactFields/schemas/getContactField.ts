const getContactFieldSchema = {
  type: "object",
  properties: {
    field_id: {
      type: "number",
      description: "ID of the contact field to fetch.",
    },
  },
  required: ["field_id"],
  additionalProperties: false,
};

export default getContactFieldSchema;
