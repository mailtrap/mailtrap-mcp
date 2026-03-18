import { z } from "zod";

const getEmailLogMessageSchema = {
  type: "object",
  properties: {
    message_id: {
      type: "string",
      description:
        "UUID of the email log message (from send response or list-email-logs)",
    },
    include_content: {
      type: "boolean",
      description:
        "When true, download the raw EML message (if available) and include parsed HTML and text body content, similar to show-sandbox-email-message.",
      default: false,
    },
  },
  required: ["message_id"],
  additionalProperties: false,
};

export const getEmailLogMessageZod = z
  .object({
    message_id: z.string().min(1, "message_id is required"),
    include_content: z.boolean().optional().default(false),
  })
  .strict();

export default getEmailLogMessageSchema;
