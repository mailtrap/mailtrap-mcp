import { sandboxIdProperty } from "./sandboxId";

const forwardSandboxMessageSchema = {
  type: "object",
  properties: {
    ...sandboxIdProperty,
    message_id: {
      type: "number",
      description: "ID of the sandbox message to forward",
    },
    email: {
      type: "string",
      description: "Email address to forward the message to",
      format: "email",
    },
  },
  required: ["message_id", "email"],
  additionalProperties: false,
};

export default forwardSandboxMessageSchema;
