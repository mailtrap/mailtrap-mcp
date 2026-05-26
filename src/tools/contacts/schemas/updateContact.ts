const updateContactSchema = {
  type: "object",
  properties: {
    contact_identifier: {
      type: "string",
      description: "Contact ID or email to update.",
    },
    email: {
      type: "string",
      description: "New email address for the contact.",
    },
    fields: {
      type: "object",
      description:
        "Custom field values to set, keyed by merge tag. String, number, or boolean values.",
      additionalProperties: {
        type: ["string", "number", "boolean"],
      },
    },
    list_ids: {
      type: "array",
      items: { type: "number" },
      description:
        "Replace the contact's list memberships with this exact set of list IDs.",
    },
    list_ids_included: {
      type: "array",
      items: { type: "number" },
      description: "List IDs to add the contact to (additive).",
    },
    list_ids_excluded: {
      type: "array",
      items: { type: "number" },
      description: "List IDs to remove the contact from.",
    },
    unsubscribed: {
      type: "boolean",
      description:
        "Move the contact to `unsubscribed` (`true`) or `subscribed` (`false`) status.",
    },
  },
  required: ["contact_identifier"],
  additionalProperties: false,
};

export default updateContactSchema;
