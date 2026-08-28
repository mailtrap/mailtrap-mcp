const getCompanyInfoSchema = {
  type: "object",
  properties: {
    sending_domain_id: {
      type: "number",
      description: "Sending domain ID",
    },
  },
  required: ["sending_domain_id"],
  additionalProperties: false,
};

export default getCompanyInfoSchema;
