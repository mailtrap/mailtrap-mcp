const getTemplateSchema = {
  type: "object",
  properties: {
    template_id: {
      type: "number",
      description: "ID of the template to fetch",
    },
  },
  required: ["template_id"],
  additionalProperties: false,
};

export default getTemplateSchema;
