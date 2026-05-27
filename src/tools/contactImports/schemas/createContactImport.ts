const createContactImportSchema = {
  type: "object",
  properties: {
    contacts: {
      type: "array",
      description:
        "Contacts to import. Each entry needs at least an `email`; optionally include custom `fields`, `list_ids_included`, and `list_ids_excluded`.",
      items: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email address of the contact.",
          },
          fields: {
            type: "object",
            description:
              "Custom field values keyed by merge tag. Values may be string or number.",
            additionalProperties: {
              type: ["string", "number"],
            },
          },
          list_ids_included: {
            type: "array",
            items: { type: "number" },
            description: "Contact list IDs to add this contact to.",
          },
          list_ids_excluded: {
            type: "array",
            items: { type: "number" },
            description: "Contact list IDs to remove this contact from.",
          },
        },
        required: ["email"],
        additionalProperties: false,
      },
    },
  },
  required: ["contacts"],
  additionalProperties: false,
};

export default createContactImportSchema;
