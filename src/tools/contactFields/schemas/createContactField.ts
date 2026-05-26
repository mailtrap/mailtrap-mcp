const createContactFieldSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: 'Display name of the field (e.g. "First Name").',
    },
    merge_tag: {
      type: "string",
      description:
        "Merge tag used in template variables (e.g. `first_name`). Must be unique.",
    },
    data_type: {
      type: "string",
      enum: ["text", "number", "boolean", "date"],
      description: "Data type stored in this field.",
    },
  },
  required: ["name", "merge_tag", "data_type"],
  additionalProperties: false,
};

export default createContactFieldSchema;
