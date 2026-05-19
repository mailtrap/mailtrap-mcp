const createContactListSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Name for the new contact list.",
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export default createContactListSchema;
