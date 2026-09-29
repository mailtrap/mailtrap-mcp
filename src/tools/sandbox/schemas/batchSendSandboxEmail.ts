import batchSendStreamEmailSchema from "../../sendEmail/schemas/batchSendStreamEmail";
import { sandboxIdProperty } from "./sandboxId";

const batchSendSandboxEmailSchema = {
  ...batchSendStreamEmailSchema,
  properties: {
    ...sandboxIdProperty,
    ...batchSendStreamEmailSchema.properties,
  },
};

export default batchSendSandboxEmailSchema;
