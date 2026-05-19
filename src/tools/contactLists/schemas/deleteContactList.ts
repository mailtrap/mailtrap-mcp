const deleteContactListSchema = {
  type: "object",
  properties: {
    list_id: {
      type: "number",
      description: "ID of the contact list to delete.",
    },
  },
  required: ["list_id"],
  additionalProperties: false,
};

export default deleteContactListSchema;
