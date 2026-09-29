import { legacySandboxInboxIdProperties } from "./sandboxId";

const getMessagesSchema = {
  type: "object",
  properties: {
    ...legacySandboxInboxIdProperties,
    page: {
      type: "number",
      description: "Page number for pagination",
      minimum: 1,
    },
    last_id: {
      type: "number",
      description:
        "Pagination using last message ID. Returns messages after the specified message ID.",
      minimum: 1,
    },
    search: {
      type: "string",
      description: "Search query to filter messages",
    },
  },
  required: [],
  additionalProperties: false,
};

export default getMessagesSchema;
