import { z } from "zod";
import { domainIdProperties, domainIdZodShape } from "../schemas/domainId";
import { omitDomainId } from "../utils/resolveDomainId";

const listDomainsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

const getDomainSchema = {
  type: "object",
  properties: {
    ...domainIdProperties,
    include_setup_instructions: {
      type: "boolean",
      description: "If true, append DNS setup instructions to the response.",
      default: false,
    },
  },
  required: [],
  additionalProperties: false,
};

const createDomainSchema = {
  type: "object",
  properties: {
    domain_name: {
      type: "string",
      description: "Domain name (e.g. example.com)",
    },
  },
  required: ["domain_name"],
  additionalProperties: false,
};

const deleteDomainSchema = {
  type: "object",
  properties: {
    ...domainIdProperties,
  },
  required: [],
  additionalProperties: false,
};

const sendDomainSetupInstructionsSchema = {
  type: "object",
  properties: {
    ...domainIdProperties,
    email: {
      type: "string",
      description: "Email address to send DNS setup instructions to",
      format: "email",
    },
  },
  required: ["email"],
  additionalProperties: false,
};

const updateDomainSchema = {
  type: "object",
  properties: {
    ...domainIdProperties,
    open_tracking_enabled: {
      type: "boolean",
      description: "Track opens on emails sent from this domain.",
    },
    click_tracking_enabled: {
      type: "boolean",
      description: "Track clicks on links in emails sent from this domain.",
    },
    tracking_opt_out_enabled: {
      type: "boolean",
      description:
        "Add the tracking opt-out link to tracked emails. Requires open or click tracking.",
    },
    auto_unsubscribe_link_enabled: {
      type: "boolean",
      description: "Automatically add an unsubscribe link to emails.",
    },
    inbound_enabled: {
      type: "boolean",
      description:
        "Allow the domain to be attached to an inbound inbox as a catch-all.",
    },
  },
  required: [],
  additionalProperties: false,
  description:
    "At least one setting besides `domain_id` must be provided. Settings left out are unchanged.",
};

export const updateDomainZod = z
  .object({
    ...domainIdZodShape,
    open_tracking_enabled: z.boolean().optional(),
    click_tracking_enabled: z.boolean().optional(),
    tracking_opt_out_enabled: z.boolean().optional(),
    auto_unsubscribe_link_enabled: z.boolean().optional(),
    inbound_enabled: z.boolean().optional(),
  })
  .strict()
  .refine((input) => Object.keys(omitDomainId(input)).length > 0, {
    message: "Provide at least one setting to update.",
  });

export {
  listDomainsSchema,
  getDomainSchema,
  createDomainSchema,
  updateDomainSchema,
  deleteDomainSchema,
  sendDomainSetupInstructionsSchema,
};
