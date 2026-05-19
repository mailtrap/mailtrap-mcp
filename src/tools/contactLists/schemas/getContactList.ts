const getContactListSchema = {
  type: "object",
  properties: {
    list_id: {
      type: "number",
      description: "ID of the contact list to fetch.",
    },
  },
  required: ["list_id"],
  additionalProperties: false,
};

export default getContactListSchema;
