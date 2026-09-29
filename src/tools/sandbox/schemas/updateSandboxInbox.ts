import { sandboxInboxIdProperties } from "./sandboxId";

const updateSandboxInboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
    name: {
      type: "string",
      description: "New name for the inbox",
    },
    email_username: {
      type: "string",
      description: "New email username for the inbox",
    },
  },
  required: [],
  additionalProperties: false,
};

export default updateSandboxInboxSchema;
