import { sandboxInboxIdProperties } from "./sandboxId";

const getSandboxInboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default getSandboxInboxSchema;
