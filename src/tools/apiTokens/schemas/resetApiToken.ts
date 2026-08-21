/**
 * Input schema for reset-api-token: `api_token_id` plus an optional
 * `expires_at` for the replacement token. Kept separate from the shared
 * `apiTokenSchema` (get, delete), which allows no extra properties.
 */
const resetApiTokenSchema = {
  type: "object",
  properties: {
    api_token_id: {
      type: "number",
      description: "ID of the API token.",
    },
    expires_at: {
      type: ["string", "null"],
      description:
        "Optional expiration for the new token as an ISO 8601 date-time (e.g. 2027-06-01T00:00:00Z). Omit for the server default (a 1-year default is being rolled out). Pass an explicit null for a token that never expires. Past values or values more than 5 years ahead are rejected with a 422 error.",
    },
  },
  required: ["api_token_id"],
  additionalProperties: false,
};

export default resetApiTokenSchema;
