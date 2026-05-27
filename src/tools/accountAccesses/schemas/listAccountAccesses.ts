import { z } from "zod";

const listAccountAccessesSchema = {
  type: "object",
  properties: {
    domain_uuids: {
      type: "array",
      items: { type: "string" },
      description: "Optional: filter by sending domain UUIDs.",
    },
    inbox_ids: {
      type: "array",
      items: { type: "string" },
      description: "Optional: filter by sandbox inbox IDs.",
    },
    project_ids: {
      type: "array",
      items: { type: "string" },
      description: "Optional: filter by sandbox project IDs.",
    },
  },
  additionalProperties: false,
};

export const listAccountAccessesZod = z
  .object({
    domain_uuids: z.array(z.string()).optional(),
    inbox_ids: z.array(z.string()).optional(),
    project_ids: z.array(z.string()).optional(),
  })
  .strict();

export default listAccountAccessesSchema;
