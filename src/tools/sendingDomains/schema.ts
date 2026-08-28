import { z } from "zod";

const listSendingDomainsSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

const getSendingDomainSchema = {
  type: "object",
  properties: {
    sending_domain_id: {
      type: "number",
      description: "Sending domain ID",
    },
    include_setup_instructions: {
      type: "boolean",
      description: "If true, append DNS setup instructions to the response.",
      default: false,
    },
  },
  required: ["sending_domain_id"],
  additionalProperties: false,
};

const createSendingDomainSchema = {
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

const deleteSendingDomainSchema = {
  type: "object",
  properties: {
    sending_domain_id: {
      type: "number",
      description: "Sending domain ID to delete",
    },
  },
  required: ["sending_domain_id"],
  additionalProperties: false,
};

const sendSendingDomainSetupInstructionsSchema = {
  type: "object",
  properties: {
    sending_domain_id: {
      type: "number",
      description: "Sending domain ID",
    },
    email: {
      type: "string",
      description: "Email address to send DNS setup instructions to",
      format: "email",
    },
  },
  required: ["sending_domain_id", "email"],
  additionalProperties: false,
};

const updateSendingDomainSchema = {
  type: "object",
  properties: {
    sending_domain_id: {
      type: "number",
      description: "Sending domain ID",
    },
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
  required: ["sending_domain_id"],
  additionalProperties: false,
  description:
    "At least one setting besides `sending_domain_id` must be provided. Settings left out are unchanged.",
};

export const updateSendingDomainZod = z
  .object({
    sending_domain_id: z.number().int().min(1),
    open_tracking_enabled: z.boolean().optional(),
    click_tracking_enabled: z.boolean().optional(),
    tracking_opt_out_enabled: z.boolean().optional(),
    auto_unsubscribe_link_enabled: z.boolean().optional(),
    inbound_enabled: z.boolean().optional(),
  })
  .strict()
  .refine(
    ({ sending_domain_id: _sendingDomainId, ...updates }) =>
      Object.keys(updates).length > 0,
    { message: "Provide at least one setting to update." }
  );

export {
  listSendingDomainsSchema,
  getSendingDomainSchema,
  createSendingDomainSchema,
  updateSendingDomainSchema,
  deleteSendingDomainSchema,
  sendSendingDomainSetupInstructionsSchema,
};
