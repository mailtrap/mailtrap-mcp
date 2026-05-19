/**
 * Shared input schema for sandbox-scoped actions that take only `sandbox_id`
 * (mark-as-read, reset-credentials, enable-email-address, reset-email-address).
 */
const sandboxActionSchema = {
  type: "object",
  properties: {
    sandbox_id: {
      type: "number",
      description: "ID of the sandbox to act on",
    },
  },
  required: ["sandbox_id"],
  additionalProperties: false,
};

export default sandboxActionSchema;
