/**
 * Shared input schema for API-token tools that take only `api_token_id`
 * (get, reset, delete).
 */
const apiTokenSchema = {
  type: "object",
  properties: {
    api_token_id: {
      type: "number",
      description: "ID of the API token.",
    },
  },
  required: ["api_token_id"],
  additionalProperties: false,
};

export default apiTokenSchema;
