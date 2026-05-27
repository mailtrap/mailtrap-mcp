const getContactExportSchema = {
  type: "object",
  properties: {
    export_id: {
      type: "number",
      description: "ID of the contact export job to fetch.",
    },
  },
  required: ["export_id"],
  additionalProperties: false,
};

export default getContactExportSchema;
