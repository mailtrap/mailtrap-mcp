const bulkUpdatePermissionsSchema = {
  type: "object",
  properties: {
    account_access_id: {
      type: "number",
      description:
        "ID of the account access whose permissions are being updated.",
    },
    permissions: {
      type: "array",
      description:
        "Permission entries to create, update, or destroy. Combinations of `resource_type` + `resource_id` that already exist are updated; new combinations are created. Set `destroy: true` to remove an existing permission.",
      items: {
        type: "object",
        properties: {
          resource_id: {
            type: ["number", "string"],
            description: "ID of the resource to grant/update access to.",
          },
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
          access_level: {
            type: "string",
            enum: ["admin", "viewer", "100", "10"],
            description:
              "Access level. `admin`/`100` for admin, `viewer`/`10` for viewer.",
          },
          destroy: {
            type: "boolean",
            description:
              "If true, destroy this permission instead of creating/updating it.",
          },
        },
        required: ["resource_id", "resource_type"],
        additionalProperties: false,
      },
    },
  },
  required: ["account_access_id", "permissions"],
  additionalProperties: false,
};

export default bulkUpdatePermissionsSchema;
