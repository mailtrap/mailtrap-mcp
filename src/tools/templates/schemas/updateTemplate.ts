const updateTemplateSchema = {
  type: "object",
  properties: {
    template_id: {
      type: "number",
      description: "ID of the template to update",
    },
    name: {
      type: "string",
      description: "New name for the template",
    },
    subject: {
      type: "string",
      description: "New email subject line",
    },
    html: {
      type: "string",
      description: "New HTML content of the template",
    },
    text: {
      type: "string",
      description: "New plain text version of the template",
    },
    category: {
      type: "string",
      description: "New category for the template",
    },
  },
  required: ["template_id"],
  additionalProperties: false,
};

export default updateTemplateSchema;
