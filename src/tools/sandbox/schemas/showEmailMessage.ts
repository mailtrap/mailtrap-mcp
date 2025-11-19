const showEmailMessageSchema = {
  type: "object",
  properties: {
    message_id: {
      type: "number",
      description: "ID of the sandbox email message to retrieve",
    },
  },
  required: ["message_id"],
  additionalProperties: false,
};

export default showEmailMessageSchema;
