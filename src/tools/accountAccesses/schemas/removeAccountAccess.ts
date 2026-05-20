const removeAccountAccessSchema = {
  type: "object",
  properties: {
    account_access_id: {
      type: "number",
      description: "ID of the account access to remove.",
    },
  },
  required: ["account_access_id"],
  additionalProperties: false,
};

export default removeAccountAccessSchema;
