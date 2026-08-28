import {
  listSendingDomainsSchema,
  getSendingDomainSchema,
  createSendingDomainSchema,
  updateSendingDomainSchema,
  deleteSendingDomainSchema,
  sendSendingDomainSetupInstructionsSchema,
} from "./schema";
import listSendingDomains from "./listSendingDomains";
import getSendingDomain from "./getSendingDomain";
import createSendingDomain from "./createSendingDomain";
import updateSendingDomain from "./updateSendingDomain";
import deleteSendingDomain from "./deleteSendingDomain";
import sendSendingDomainSetupInstructions from "./sendSetupInstructions";

export {
  listSendingDomainsSchema,
  listSendingDomains,
  getSendingDomainSchema,
  getSendingDomain,
  createSendingDomainSchema,
  createSendingDomain,
  updateSendingDomainSchema,
  updateSendingDomain,
  deleteSendingDomainSchema,
  deleteSendingDomain,
  sendSendingDomainSetupInstructionsSchema,
  sendSendingDomainSetupInstructions,
};
