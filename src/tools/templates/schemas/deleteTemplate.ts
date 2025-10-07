const deleteTemplateSchema = {
  type: "object",
  properties: {
    template_id: {
      type: "number",
      description: "ID of the template to delete",
    },
  },
  required: ["template_id"],
  additionalProperties: false,
};

export default deleteTemplateSchema;
