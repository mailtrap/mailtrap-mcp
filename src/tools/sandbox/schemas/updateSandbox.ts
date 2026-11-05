import { sandboxInboxIdProperties } from "./sandboxId";

const updateSandboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
    name: {
      type: "string",
      description: "New name for the sandbox",
    },
    email_username: {
      type: "string",
      description: "New email username for the sandbox",
    },
  },
  required: [],
  additionalProperties: false,
};

export default updateSandboxSchema;
