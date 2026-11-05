import { sandboxInboxIdProperties } from "./sandboxId";

const getSandboxSchema = {
  type: "object",
  properties: {
    ...sandboxInboxIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default getSandboxSchema;
