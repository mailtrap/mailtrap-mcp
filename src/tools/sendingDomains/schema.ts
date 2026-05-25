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

export {
  listSendingDomainsSchema,
  getSendingDomainSchema,
  createSendingDomainSchema,
  deleteSendingDomainSchema,
  sendSendingDomainSetupInstructionsSchema,
};
