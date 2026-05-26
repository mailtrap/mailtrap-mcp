const listSuppressionsSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      description:
        "Optional email filter. Returns suppressions matching this address.",
    },
  },
  additionalProperties: false,
};

export default listSuppressionsSchema;
