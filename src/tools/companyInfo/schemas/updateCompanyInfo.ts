import { z } from "zod";
import { domainIdProperties, domainIdZodShape } from "../../schemas/domainId";
import { omitDomainId } from "../../utils/resolveDomainId";

const updateCompanyInfoSchema = {
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
  required: [],
  additionalProperties: false,
  description:
    "At least one field besides `domain_id` must be provided. Fields left out are unchanged.",
};

export const updateCompanyInfoZod = z
  .object({
    ...domainIdZodShape,
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
  .refine((input) => Object.keys(omitDomainId(input)).length > 0, {
    message: "Provide at least one field to update.",
  });

export default updateCompanyInfoSchema;
