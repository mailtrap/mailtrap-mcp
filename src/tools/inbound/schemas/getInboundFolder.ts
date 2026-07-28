import { z } from "zod";

const getInboundFolderSchema = {
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

export const getInboundFolderZod = z
  .object({
    folder_id: z.number(),
  })
  .strict();

export default getInboundFolderSchema;
