const createContactSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description: "Email address of the contact.",
    },
    fields: {
      type: "object",
      description:
        "Custom field values keyed by the field's merge tag (e.g. `first_name`). Values may be string, number, or boolean.",
      additionalProperties: {
        type: ["string", "number", "boolean"],
      },
    },
    list_ids: {
      type: "array",
      items: { type: "number" },
      description: "IDs of contact lists to add this contact to.",
    },
    unsubscribed: {
      type: "boolean",
      description: "If true, the contact is created in `unsubscribed` status.",
    },
  },
  required: ["email"],
  additionalProperties: false,
};

export default createContactSchema;
