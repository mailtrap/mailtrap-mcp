/**
 * JSON Schema fragment: email string or `{ email, name? }` for Mailtrap Address fields.
 */
const mailtrapAddressParamSchema = {
  oneOf: [
    {
      type: "string",
      format: "email",
      description: "Email address",
    },
    {
      type: "object",
      description: "Address with optional display name",
      properties: {
        email: {
          type: "string",
          format: "email",
          description: "Email address",
        },
        name: {
          type: "string",
          description: "Display name for this address",
        },
      },
      required: ["email"],
      additionalProperties: false,
    },
  ],
};

export default mailtrapAddressParamSchema;
