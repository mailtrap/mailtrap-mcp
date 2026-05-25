import {
  listSendingDomainsSchema,
  getSendingDomainSchema,
  createSendingDomainSchema,
  deleteSendingDomainSchema,
  sendSendingDomainSetupInstructionsSchema,
} from "./schema";
import listSendingDomains from "./listSendingDomains";
import getSendingDomain from "./getSendingDomain";
import createSendingDomain from "./createSendingDomain";
import deleteSendingDomain from "./deleteSendingDomain";
import sendSendingDomainSetupInstructions from "./sendSetupInstructions";

export {
  listSendingDomainsSchema,
  listSendingDomains,
  getSendingDomainSchema,
  getSendingDomain,
  createSendingDomainSchema,
  createSendingDomain,
  deleteSendingDomainSchema,
  deleteSendingDomain,
  sendSendingDomainSetupInstructionsSchema,
  sendSendingDomainSetupInstructions,
};
