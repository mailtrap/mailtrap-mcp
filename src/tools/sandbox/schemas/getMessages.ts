const getMessagesSchema = {
  type: "object",
  properties: {
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
    limit: {
      type: "number",
      description:
        "Number of messages per page (default: 10, max: 100). Note: This parameter is not supported by the Mailtrap SDK and will be ignored.",
      minimum: 1,
      maximum: 100,
    },
  },
  required: [],
  additionalProperties: false,
};

export default getMessagesSchema;
