const getContactImportSchema = {
  type: "object",
  properties: {
    import_id: {
      type: "number",
      description: "ID of the contact import job to fetch.",
    },
  },
  required: ["import_id"],
  additionalProperties: false,
};

export default getContactImportSchema;
