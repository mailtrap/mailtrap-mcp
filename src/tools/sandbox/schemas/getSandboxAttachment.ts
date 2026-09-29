import { sandboxIdProperty } from "./sandboxId";

const getSandboxAttachmentSchema = {
  type: "object",
  properties: {
    ...sandboxIdProperty,
    message_id: {
      type: "number",
      description: "ID of the sandbox message that contains the attachment",
    },
    attachment_id: {
      type: "number",
      description: "ID of the attachment to fetch",
    },
  },
  required: ["message_id", "attachment_id"],
  additionalProperties: false,
};

export default getSandboxAttachmentSchema;
