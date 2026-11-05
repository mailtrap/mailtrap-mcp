import { domainIdProperties } from "../../schemas/domainId";

const getCompanyInfoSchema = {
  type: "object",
  properties: {
    ...domainIdProperties,
  },
  required: [],
  additionalProperties: false,
};

export default getCompanyInfoSchema;
