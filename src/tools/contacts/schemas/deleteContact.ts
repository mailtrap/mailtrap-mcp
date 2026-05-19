const deleteContactSchema = {
  type: "object",
  properties: {
    contact_identifier: {
      type: "string",
      description: "Contact ID or email to delete.",
    },
  },
  required: ["contact_identifier"],
  additionalProperties: false,
};

export default deleteContactSchema;
