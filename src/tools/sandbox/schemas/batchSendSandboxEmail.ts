import batchSendStreamEmailSchema from "../../sendEmail/schemas/batchSendStreamEmail";

const batchSendSandboxEmailSchema = {
  ...batchSendStreamEmailSchema,
  properties: {
    sandbox_id: {
      type: "number",
      description:
        "Mailtrap sandbox (test inbox) ID. Optional if MAILTRAP_SANDBOX_ID env var is set. Use to target a specific sandbox.",
    },
    ...batchSendStreamEmailSchema.properties,
  },
};

export default batchSendSandboxEmailSchema;
