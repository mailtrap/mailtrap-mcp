const createApiTokenSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Display name for the API token.",
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
            enum: [
              "account",
              "project",
              "inbox",
              "sending_domain",
              "billing",
              "mailsend_domain",
            ],
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
