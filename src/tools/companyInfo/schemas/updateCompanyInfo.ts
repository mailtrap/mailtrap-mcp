import { z } from "zod";

const updateCompanyInfoSchema = {
  type: "object",
  properties: {
    sending_domain_id: {
      type: "number",
      description: "Sending domain ID",
    },
    name: {
      type: "string",
      description: "Company or individual name.",
    },
    address: {
      type: "string",
      description: "Street address.",
    },
    city: {
      type: "string",
      description: "City.",
    },
    country: {
      type: "string",
      description: "Country.",
    },
    zip_code: {
      type: "string",
      description: "ZIP or postal code.",
    },
    website_url: {
      type: "string",
      description: "Company website URL.",
    },
    phone: {
      type: "string",
      description: "Phone number.",
    },
    privacy_policy_url: {
      type: "string",
      description: "URL of the privacy policy page.",
    },
    terms_of_service_url: {
      type: "string",
      description: "URL of the terms of service page.",
    },
    info_level: {
      type: "string",
      enum: ["business", "individual"],
      description: "Whether the sender is a business or an individual.",
    },
  },
  required: ["sending_domain_id"],
  additionalProperties: false,
  description:
    "At least one field besides `sending_domain_id` must be provided. Fields left out are unchanged.",
};

export const updateCompanyInfoZod = z
  .object({
    sending_domain_id: z.number().int().min(1),
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    zip_code: z.string().optional(),
    website_url: z.string().optional(),
    phone: z.string().optional(),
    privacy_policy_url: z.string().optional(),
    terms_of_service_url: z.string().optional(),
    info_level: z.enum(["business", "individual"]).optional(),
  })
  .strict()
  .refine(
    ({ sending_domain_id: _sendingDomainId, ...updates }) =>
      Object.keys(updates).length > 0,
    { message: "Provide at least one field to update." }
  );

export default updateCompanyInfoSchema;
