const createTemplateSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Name of the template",
    },
    subject: {
      type: "string",
      description: "Email subject line",
    },
    html: {
      type: "string",
      description: "HTML content of the template (optional)",
    },
    text: {
      type: "string",
      description: "Plain text version of the template (optional)",
    },
    category: {
      type: "string",
      description: "Template category (optional, defaults to 'General')",
    },
  },
  required: ["name", "subject"],
  additionalProperties: false,
};

export default createTemplateSchema;
