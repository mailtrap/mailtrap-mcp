import { sandboxInboxIdProperties } from "./sandboxId";

const deleteSandboxInboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default deleteSandboxInboxSchema;
