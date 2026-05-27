const createContactExportSchema = {
  type: "object",
  properties: {
    filters: {
      type: "array",
      description:
        "Filters that select which contacts to include in the export. AND-combined.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "Field to filter on (e.g. `list_id`, `subscription_status`, `email`).",
          },
          operator: {
            type: "string",
            enum: [
              "equal",
              "not_equal",
              "contains",
              "not_contains",
              "is_empty",
              "is_not_empty",
            ],
            description: "Comparison operator.",
          },
          value: {
            description:
              "Comparison value. Type depends on the field — string, number, boolean, or array.",
          },
        },
        required: ["name", "operator"],
        allOf: [
          {
            if: {
              properties: {
                operator: { enum: ["is_empty", "is_not_empty"] },
              },
              required: ["operator"],
            },
            then: {
              not: { required: ["value"] },
            },
            else: {
              required: ["value"],
            },
          },
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["filters"],
  additionalProperties: false,
};

export default createContactExportSchema;
