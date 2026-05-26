const updateContactListSchema = {
  type: "object",
  properties: {
    list_id: {
      type: "number",
      description: "ID of the contact list to update.",
    },
    name: {
      type: "string",
      description: "New name for the contact list.",
    },
  },
  required: ["list_id", "name"],
  additionalProperties: false,
};

export default updateContactListSchema;
