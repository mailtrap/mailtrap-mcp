import { z } from "zod";
import { domainIdProperties, domainIdZodShape } from "../../schemas/domainId";

const createCompanyInfoSchema = {
  type: "object",
  properties: {
    ...domainIdProperties,
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
  required: ["name", "address", "city", "country", "zip_code", "website_url"],
  additionalProperties: false,
};

export const createCompanyInfoZod = z
  .object({
    ...domainIdZodShape,
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    zip_code: z.string().min(1),
    website_url: z.string().min(1),
    phone: z.string().optional(),
    privacy_policy_url: z.string().optional(),
    terms_of_service_url: z.string().optional(),
    info_level: z.enum(["business", "individual"]).optional(),
  })
  .strict();

export default createCompanyInfoSchema;
