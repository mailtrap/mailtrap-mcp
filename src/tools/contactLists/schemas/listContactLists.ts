import { z } from "zod";

const listContactListsSchema = {
  type: "object",
  properties: {
    search: {
      type: "string",
      description:
        'Filter contact lists by name (case-insensitive match), e.g. "news".',
    },
  },
  required: [],
  additionalProperties: false,
};

export const listContactListsZod = z
  .object({
    search: z.string().optional(),
  })
  .strict();

export default listContactListsSchema;
