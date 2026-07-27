import { z } from "zod";

const updateInboundFolderSchema = {
  type: "object",
  properties: {
    folder_id: {
      type: "number",
      description: "The inbound folder ID.",
    },
    name: {
      type: "string",
      description: "The new folder name.",
    },
  },
  required: ["folder_id", "name"],
  additionalProperties: false,
};

export const updateInboundFolderZod = z
  .object({
    folder_id: z.number(),
    name: z.string(),
  })
  .strict();

export default updateInboundFolderSchema;
