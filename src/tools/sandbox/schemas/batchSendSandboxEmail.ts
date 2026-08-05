import batchSendStreamEmailSchema from "../../sendEmail/schemas/batchSendStreamEmail";

const batchSendSandboxEmailSchema = {
  ...batchSendStreamEmailSchema,
  properties: {
    test_inbox_id: {
      type: "number",
      description:
        "Mailtrap test inbox ID. Optional if MAILTRAP_TEST_INBOX_ID env var is set. Use to target a specific inbox.",
    },
    ...batchSendStreamEmailSchema.properties,
  },
};

export default batchSendSandboxEmailSchema;
