import { z } from "zod";

const createInboundFolderSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The folder name.",
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export const createInboundFolderZod = z
  .object({
    name: z.string(),
  })
  .strict();

export default createInboundFolderSchema;
