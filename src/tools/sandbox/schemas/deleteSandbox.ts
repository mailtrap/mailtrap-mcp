import { sandboxInboxIdProperties } from "./sandboxId";

const deleteSandboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default deleteSandboxSchema;
