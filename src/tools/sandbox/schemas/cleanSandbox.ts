import { sandboxInboxIdProperties } from "./sandboxId";

const cleanSandboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default cleanSandboxSchema;
