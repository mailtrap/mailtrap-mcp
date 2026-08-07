const createApiTokenSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Display name for the API token.",
    },
    expires_at: {
      type: ["string", "null"],
      description:
        "Optional token expiration as an ISO 8601 date-time (e.g. 2027-06-01T00:00:00Z). Omit for the server default (a 1-year default is being rolled out). Pass an explicit null for a token that never expires. Past values or values more than 5 years ahead are rejected with a 422 error.",
    },
    resources: {
      type: "array",
      description:
        "Optional list of resource permissions to attach to the token. Each entry pins the token to a specific resource at a given access level.",
      items: {
        type: "object",
        properties: {
          resource_type: {
            type: "string",
            enum: ["account", "project", "inbox", "domain", "billing"],
            description: "Type of resource.",
          },
          resource_id: {
            type: ["number", "string"],
            description: "ID of the resource.",
          },
          access_level: {
            type: "number",
            enum: [10, 100],
            description: "Access level: 100 = admin, 10 = viewer.",
          },
        },
        required: ["resource_type", "resource_id", "access_level"],
        additionalProperties: false,
      },
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export default createApiTokenSchema;
