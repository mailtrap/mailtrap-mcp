import { z } from "zod";

const listInboundFoldersSchema = {
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
};

export const listInboundFoldersZod = z.object({}).strict();

export default listInboundFoldersSchema;
