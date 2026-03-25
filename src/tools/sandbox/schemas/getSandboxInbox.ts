const getSandboxInboxSchema = {
  type: "object",
  properties: {
    inbox_id: {
      type: "number",
      description:
        "ID of the sandbox inbox. Optional if MAILTRAP_TEST_INBOX_ID env var is set.",
    },
  },
  required: [],
  additionalProperties: false,
};

export default getSandboxInboxSchema;
