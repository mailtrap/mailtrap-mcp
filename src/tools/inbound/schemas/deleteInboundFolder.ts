import { z } from "zod";

const deleteInboundFolderSchema = {
  type: "object",
  properties: {
    folder_id: {
      type: "number",
      description: "The inbound folder ID.",
    },
  },
  required: ["folder_id"],
  additionalProperties: false,
};

export const deleteInboundFolderZod = z
  .object({
    folder_id: z.number(),
  })
  .strict();

export default deleteInboundFolderSchema;
