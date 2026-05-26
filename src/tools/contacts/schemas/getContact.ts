const getContactSchema = {
  type: "object",
  properties: {
    contact_identifier: {
      type: "string",
      description: "Contact ID or email address.",
    },
  },
  required: ["contact_identifier"],
  additionalProperties: false,
};

export default getContactSchema;
