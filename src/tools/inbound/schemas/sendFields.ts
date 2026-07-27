import { z } from "zod";

import mailtrapAddressParamSchema, {
  mailtrapAddressListParamSchema,
  mailtrapBccParamSchema,
  mailtrapCcParamSchema,
  mailtrapFromParamSchema,
} from "../../schemas/mailtrapAddressParam";

// Shared request-body fields for reply / reply_all / forward.
// Address fields reuse the shared send-tool param schemas, and handlers
// normalize them at runtime via utils/sendParams -> utils/mailtrapAddresses,
// so bare email strings, `{ email, name? }` objects, and JSON-stringified
// forms are all accepted — exactly like the send-email tools.

export const sendMessageProperties = {
  from: {
    ...mailtrapFromParamSchema,
    description:
      "Sender. Rejected for Mailtrap-hosted inboxes; required for custom-domain inboxes.",
  },
  to: {
    ...mailtrapAddressListParamSchema,
    description:
      "Recipients. Defaults to the original sender for reply/reply_all when omitted; required for forward.",
  },
  cc: mailtrapCcParamSchema,
  bcc: mailtrapBccParamSchema,
  reply_to: {
    ...mailtrapAddressParamSchema,
    description: "Reply-To address.",
  },
  text: { type: "string", description: "Plain-text body." },
  html: { type: "string", description: "HTML body." },
  category: { type: "string", description: "Message category." },
  attachments: {
    type: "array",
    description: "File attachments.",
    items: {
      type: "object",
      properties: {
        content: { type: "string", description: "Base64-encoded content." },
        filename: { type: "string", description: "File name." },
        type: { type: "string", description: "MIME type." },
        disposition: { type: "string", enum: ["attachment", "inline"] },
        content_id: { type: "string", description: "Content-ID for inline." },
      },
      required: ["content", "filename"],
      additionalProperties: false,
    },
  },
  headers: {
    type: "object",
    description: "Custom headers.",
    additionalProperties: { type: "string" },
  },
  custom_variables: {
    type: "object",
    description: "Custom variables.",
    additionalProperties: { type: "string" },
  },
};

const attachmentZod = z
  .object({
    content: z.string(),
    filename: z.string(),
    type: z.string().optional(),
    disposition: z.enum(["attachment", "inline"]).optional(),
    content_id: z.string().optional(),
  })
  .strict();

// Addresses are validated/normalized at runtime by the shared normalizers
// (which also accept bare strings and JSON-stringified forms), so they are
// accepted permissively here rather than strictly typed in Zod.
export const sendMessageZodShape = {
  from: z.unknown().optional(),
  to: z.unknown().optional(),
  cc: z.unknown().optional(),
  bcc: z.unknown().optional(),
  reply_to: z.unknown().optional(),
  text: z.string().optional(),
  html: z.string().optional(),
  category: z.string().optional(),
  attachments: z.array(attachmentZod).optional(),
  headers: z.record(z.string()).optional(),
  custom_variables: z.record(z.string()).optional(),
};
