const updateContactFieldSchema = {
  type: "object",
  properties: {
    field_id: {
      type: "number",
      description: "ID of the contact field to update.",
    },
    name: {
      type: "string",
      description: "New display name for the field.",
    },
    merge_tag: {
      type: "string",
      description: "New merge tag for the field. Must be unique.",
    },
    data_type: {
      type: "string",
      enum: ["text", "number", "boolean", "date"],
      description: "New data type for the field.",
    },
  },
  required: ["field_id"],
  additionalProperties: false,
};

export default updateContactFieldSchema;
