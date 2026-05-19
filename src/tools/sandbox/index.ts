import sendSandboxEmailSchema from "./schemas/sendSandboxEmail";
import sendSandboxEmail from "./sendSandboxEmail";
import getMessagesSchema from "./schemas/getMessages";
import getMessages from "./getSandboxMessages";
import showEmailMessageSchema from "./schemas/showEmailMessage";
import showEmailMessage from "./showSandboxEmailMessage";
import listProjectsSchema from "./schemas/listProjects";
import listProjects from "./listProjects";
import createProjectSchema from "./schemas/createProject";
import createProject from "./createProject";
import getProjectSchema from "./schemas/getProject";
import getProject from "./getProject";
import updateProjectSchema from "./schemas/updateProject";
import updateProject from "./updateProject";
import deleteProjectSchema from "./schemas/deleteProject";
import deleteProject from "./deleteProject";
import createSandboxInboxSchema from "./schemas/createSandboxInbox";
import createSandboxInbox from "./createSandboxInbox";
import getSandboxInboxSchema from "./schemas/getSandboxInbox";
import getSandboxInbox from "./getSandboxInbox";
import updateSandboxInboxSchema from "./schemas/updateSandboxInbox";
import updateSandboxInbox from "./updateSandboxInbox";
import deleteSandboxInboxSchema from "./schemas/deleteSandboxInbox";
import deleteSandboxInbox from "./deleteSandboxInbox";
import cleanSandboxInboxSchema from "./schemas/cleanSandboxInbox";
import cleanSandboxInbox from "./cleanSandboxInbox";

// Sandbox management additions
import listSandboxesSchema from "./schemas/listSandboxes";
import listSandboxes from "./listSandboxes";
import sandboxActionSchema from "./schemas/sandboxAction";
import markSandboxAsRead from "./markSandboxAsRead";
import resetSandboxCredentials from "./resetSandboxCredentials";
import enableSandboxEmailAddress from "./enableSandboxEmailAddress";
import resetSandboxEmailAddress from "./resetSandboxEmailAddress";

// Message management additions
import sandboxMessageSchema from "./schemas/sandboxMessage";
import forwardSandboxMessageSchema from "./schemas/forwardSandboxMessage";
import updateSandboxMessageSchema from "./schemas/updateSandboxMessage";
import forwardSandboxMessage from "./forwardSandboxMessage";
import updateSandboxMessage from "./updateSandboxMessage";
import deleteSandboxMessage from "./deleteSandboxMessage";
import getSandboxMessageSpamScore from "./getSandboxMessageSpamScore";
import getSandboxMessageHtmlAnalysis from "./getSandboxMessageHtmlAnalysis";
import getSandboxMessageHeaders from "./getSandboxMessageHeaders";
import getSandboxMessageHtml from "./getSandboxMessageHtml";
import getSandboxMessageText from "./getSandboxMessageText";
import getSandboxMessageRaw from "./getSandboxMessageRaw";
import getSandboxMessageEml from "./getSandboxMessageEml";
import getSandboxMessageHtmlSource from "./getSandboxMessageHtmlSource";

// Attachment additions
import getSandboxAttachmentSchema from "./schemas/getSandboxAttachment";
import listSandboxAttachments from "./listSandboxAttachments";
import getSandboxAttachment from "./getSandboxAttachment";

export {
  sendSandboxEmailSchema,
  sendSandboxEmail,
  getMessagesSchema,
  getMessages,
  showEmailMessageSchema,
  showEmailMessage,
  listProjectsSchema,
  listProjects,
  createProjectSchema,
  createProject,
  getProjectSchema,
  getProject,
  updateProjectSchema,
  updateProject,
  deleteProjectSchema,
  deleteProject,
  createSandboxInboxSchema,
  createSandboxInbox,
  getSandboxInboxSchema,
  getSandboxInbox,
  updateSandboxInboxSchema,
  updateSandboxInbox,
  deleteSandboxInboxSchema,
  deleteSandboxInbox,
  cleanSandboxInboxSchema,
  cleanSandboxInbox,
  // Sandbox management additions
  listSandboxesSchema,
  listSandboxes,
  sandboxActionSchema,
  markSandboxAsRead,
  resetSandboxCredentials,
  enableSandboxEmailAddress,
  resetSandboxEmailAddress,
  // Message management additions
  sandboxMessageSchema,
  forwardSandboxMessageSchema,
  updateSandboxMessageSchema,
  forwardSandboxMessage,
  updateSandboxMessage,
  deleteSandboxMessage,
  getSandboxMessageSpamScore,
  getSandboxMessageHtmlAnalysis,
  getSandboxMessageHeaders,
  getSandboxMessageHtml,
  getSandboxMessageText,
  getSandboxMessageRaw,
  getSandboxMessageEml,
  getSandboxMessageHtmlSource,
  // Attachment additions
  getSandboxAttachmentSchema,
  listSandboxAttachments,
  getSandboxAttachment,
};
