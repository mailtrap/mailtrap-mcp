import { sandboxIdProperty } from "./sandboxId";

const updateSandboxMessageSchema = {
  type: "object",
  properties: {
    ...sandboxIdProperty,
    message_id: {
      type: "number",
      description: "ID of the sandbox message to update",
    },
    is_read: {
      type: "boolean",
      description: "Mark the message as read (true) or unread (false)",
    },
  },
  required: ["message_id", "is_read"],
  additionalProperties: false,
};

export default updateSandboxMessageSchema;
