import { sandboxIdProperty } from "./sandboxId";

/**
 * Shared input schema for message-scoped sandbox tools that take
 * `sandbox_id` (optional, env fallback) and `message_id`.
 */
const sandboxMessageSchema = {
  type: "object",
  properties: {
    ...sandboxIdProperty,
    message_id: {
      type: "number",
      description: "ID of the sandbox message",
    },
  },
  required: ["message_id"],
  additionalProperties: false,
};

export default sandboxMessageSchema;
