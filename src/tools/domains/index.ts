import {
  listDomainsSchema,
  getDomainSchema,
  createDomainSchema,
  updateDomainSchema,
  deleteDomainSchema,
  sendDomainSetupInstructionsSchema,
} from "./schema";
import listDomains from "./listDomains";
import getDomain from "./getDomain";
import createDomain from "./createDomain";
import updateDomain from "./updateDomain";
import deleteDomain from "./deleteDomain";
import sendDomainSetupInstructions from "./sendSetupInstructions";

export {
  listDomainsSchema,
  listDomains,
  getDomainSchema,
  getDomain,
  createDomainSchema,
  createDomain,
  updateDomainSchema,
  updateDomain,
  deleteDomainSchema,
  deleteDomain,
  sendDomainSetupInstructionsSchema,
  sendDomainSetupInstructions,
};
