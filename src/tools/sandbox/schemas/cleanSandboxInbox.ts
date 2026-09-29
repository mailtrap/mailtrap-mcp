import { sandboxInboxIdProperties } from "./sandboxId";

const cleanSandboxInboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default cleanSandboxInboxSchema;
