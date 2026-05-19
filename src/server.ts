import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import CONFIG from "./config";

// Environment variables are now set directly by MCPB from user_config
// No need to process them here

import { sendEmailSchema, sendEmail } from "./tools/sendEmail";
import {
  createTemplate,
  createTemplateSchema,
  deleteTemplate,
  deleteTemplateSchema,
  listTemplates,
  listTemplatesSchema,
  getTemplate,
  getTemplateSchema,
  updateTemplate,
  updateTemplateSchema,
} from "./tools/templates";
import {
  sendSandboxEmail,
  sendSandboxEmailSchema,
  getMessages,
  getMessagesSchema,
  showEmailMessage,
  showEmailMessageSchema,
  listProjects,
  listProjectsSchema,
  createProject,
  createProjectSchema,
  getProject,
  getProjectSchema,
  updateProject,
  updateProjectSchema,
  deleteProject,
  deleteProjectSchema,
  createSandboxInbox,
  createSandboxInboxSchema,
  getSandboxInbox,
  getSandboxInboxSchema,
  updateSandboxInbox,
  updateSandboxInboxSchema,
  deleteSandboxInbox,
  deleteSandboxInboxSchema,
  cleanSandboxInbox,
  cleanSandboxInboxSchema,
  // Sandbox management additions
  listSandboxes,
  listSandboxesSchema,
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
} from "./tools/sandbox";
import { getSendingStats, getSendingStatsSchema } from "./tools/stats";
import {
  listEmailLogs,
  listEmailLogsSchema,
  getEmailLogMessage,
  getEmailLogMessageSchema,
} from "./tools/emailLogs";
import {
  listSendingDomains,
  listSendingDomainsSchema,
  getSendingDomain,
  getSendingDomainSchema,
  createSendingDomain,
  createSendingDomainSchema,
  deleteSendingDomain,
  deleteSendingDomainSchema,
  sendSendingDomainSetupInstructions,
  sendSendingDomainSetupInstructionsSchema,
} from "./tools/sendingDomains";
import {
  listSuppressions,
  listSuppressionsSchema,
  deleteSuppression,
  deleteSuppressionSchema,
} from "./tools/suppressions";
import {
  listWebhooks,
  listWebhooksSchema,
  getWebhook,
  getWebhookSchema,
  createWebhook,
  createWebhookSchema,
  updateWebhook,
  updateWebhookSchema,
  deleteWebhook,
  deleteWebhookSchema,
} from "./tools/webhooks";
import {
  getContact,
  getContactSchema,
  createContact,
  createContactSchema,
  updateContact,
  updateContactSchema,
  deleteContact,
  deleteContactSchema,
  createContactEvent,
  createContactEventSchema,
} from "./tools/contacts";
import {
  listContactLists,
  listContactListsSchema,
  getContactList,
  getContactListSchema,
  createContactList,
  createContactListSchema,
  updateContactList,
  updateContactListSchema,
} from "./tools/contactLists";

// Define the tools registry
const tools = [
  {
    name: "send-email",
    description:
      "Send an email to your recipient email address using Mailtrap Email API. You can send emails to multiple recipients at once.",
    inputSchema: sendEmailSchema,
    handler: sendEmail,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "create-template",
    description: "Create a new email template",
    inputSchema: createTemplateSchema,
    handler: createTemplate,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "list-templates",
    description: "List all email templates",
    inputSchema: listTemplatesSchema,
    handler: listTemplates,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-template",
    description:
      "Get a single email template by ID, including subject, category, and HTML/text body.",
    inputSchema: getTemplateSchema,
    handler: getTemplate,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "update-template",
    description: "Update an existing email template",
    inputSchema: updateTemplateSchema,
    handler: updateTemplate,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-template",
    description: "Delete an existing email template",
    inputSchema: deleteTemplateSchema,
    handler: deleteTemplate,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "send-sandbox-email",
    description:
      "Send an email in sandbox mode to a test inbox without delivering to your recipients",
    inputSchema: sendSandboxEmailSchema,
    handler: sendSandboxEmail,
    annotations: {
      destructiveHint: false,
    },
  },
  {
    name: "get-sandbox-messages",
    description: "Get list of messages from the sandbox test inbox",
    inputSchema: getMessagesSchema,
    handler: getMessages,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "show-sandbox-email-message",
    description:
      "Show sandbox email message details and content from the sandbox test inbox. Optionally include spam report (SpamAssassin score) and HTML analysis (client compatibility) for email testing workflows.",
    inputSchema: showEmailMessageSchema,
    handler: showEmailMessage,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "list-sandbox-projects",
    description:
      "List all sandbox projects and their inboxes in your Mailtrap account",
    inputSchema: listProjectsSchema,
    handler: listProjects,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "create-sandbox-project",
    description: "Create a new sandbox project to group test inboxes",
    inputSchema: createProjectSchema,
    handler: createProject,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "get-sandbox-project",
    description:
      "Get a sandbox project by ID, including its inboxes and email counts",
    inputSchema: getProjectSchema,
    handler: getProject,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "update-sandbox-project",
    description: "Rename an existing sandbox project",
    inputSchema: updateProjectSchema,
    handler: updateProject,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-sandbox-project",
    description: "Delete a sandbox project and all its inboxes",
    inputSchema: deleteProjectSchema,
    handler: deleteProject,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "create-sandbox-inbox",
    description:
      "Create a new sandbox test inbox within a project. Returns SMTP credentials for the new inbox.",
    inputSchema: createSandboxInboxSchema,
    handler: createSandboxInbox,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "get-sandbox-inbox",
    description:
      "Get sandbox inbox details including SMTP credentials, email counts, and status",
    inputSchema: getSandboxInboxSchema,
    handler: getSandboxInbox,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "update-sandbox-inbox",
    description: "Update a sandbox inbox name or email username",
    inputSchema: updateSandboxInboxSchema,
    handler: updateSandboxInbox,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-sandbox-inbox",
    description: "Delete a sandbox inbox and all its messages",
    inputSchema: deleteSandboxInboxSchema,
    handler: deleteSandboxInbox,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "clean-sandbox-inbox",
    description:
      "Delete all messages from a sandbox inbox without deleting the inbox itself",
    inputSchema: cleanSandboxInboxSchema,
    handler: cleanSandboxInbox,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "list-sandboxes",
    description:
      "List all sandboxes accessible to the API token across projects",
    inputSchema: listSandboxesSchema,
    handler: listSandboxes,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "mark-sandbox-as-read",
    description: "Mark all messages in a sandbox as read",
    inputSchema: sandboxActionSchema,
    handler: markSandboxAsRead,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "reset-sandbox-credentials",
    description: "Reset the SMTP credentials for a sandbox",
    inputSchema: sandboxActionSchema,
    handler: resetSandboxCredentials,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "enable-sandbox-email-address",
    description: "Enable the receive-by-email address for a sandbox",
    inputSchema: sandboxActionSchema,
    handler: enableSandboxEmailAddress,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "reset-sandbox-email-address",
    description: "Generate a new receive-by-email address for a sandbox",
    inputSchema: sandboxActionSchema,
    handler: resetSandboxEmailAddress,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "forward-sandbox-message",
    description:
      "Forward a sandbox message to an email address (counts against your monthly forwarding quota)",
    inputSchema: forwardSandboxMessageSchema,
    handler: forwardSandboxMessage,
    annotations: {
      destructiveHint: false,
    },
  },
  {
    name: "update-sandbox-message",
    description: "Mark a sandbox message as read or unread",
    inputSchema: updateSandboxMessageSchema,
    handler: updateSandboxMessage,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-sandbox-message",
    description: "Delete a single sandbox message",
    inputSchema: sandboxMessageSchema,
    handler: deleteSandboxMessage,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "get-sandbox-message-spam-score",
    description:
      "Get the SpamAssassin spam report for a sandbox message (score, rules, report).",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageSpamScore,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-html-analysis",
    description:
      "Get HTML analysis for a sandbox message (client compatibility, problematic elements).",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageHtmlAnalysis,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-headers",
    description: "Get the parsed mail headers for a sandbox message.",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageHeaders,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-html",
    description: "Get the rendered HTML body of a sandbox message.",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageHtml,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-text",
    description: "Get the plain-text body of a sandbox message.",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageText,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-raw",
    description: "Get the raw message (MIME-formatted) for a sandbox message.",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageRaw,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-eml",
    description: "Get a sandbox message as an EML file payload.",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageEml,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-message-html-source",
    description: "Get the unrendered HTML source of a sandbox message.",
    inputSchema: sandboxMessageSchema,
    handler: getSandboxMessageHtmlSource,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "list-sandbox-attachments",
    description: "List all attachments on a sandbox message.",
    inputSchema: sandboxMessageSchema,
    handler: listSandboxAttachments,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sandbox-attachment",
    description:
      "Get the metadata and download URL for a single sandbox attachment.",
    inputSchema: getSandboxAttachmentSchema,
    handler: getSandboxAttachment,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sending-stats",
    description:
      "Get email sending statistics (delivery, bounce, open, click, spam rates) for a date range. Optionally break down by domain, category, email service provider, or date.",
    inputSchema: getSendingStatsSchema,
    handler: getSendingStats,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "list-email-logs",
    description:
      "List sent email logs (delivery history) with optional pagination and filters; use to debug delivery issues.",
    inputSchema: listEmailLogsSchema,
    handler: listEmailLogs,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-email-log-message",
    description:
      "Get a single email log message by ID (UUID) to inspect delivery status and event history.",
    inputSchema: getEmailLogMessageSchema,
    handler: getEmailLogMessage,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "list-sending-domains",
    description: "List sending domains and their DNS verification status",
    inputSchema: listSendingDomainsSchema,
    handler: listSendingDomains,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-sending-domain",
    description:
      "Get a sending domain by ID and its verification status. Optionally include DNS setup instructions via include_setup_instructions.",
    inputSchema: getSendingDomainSchema,
    handler: getSendingDomain,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "create-sending-domain",
    description: "Create a new sending domain",
    inputSchema: createSendingDomainSchema,
    handler: createSendingDomain,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-sending-domain",
    description: "Delete a sending domain",
    inputSchema: deleteSendingDomainSchema,
    handler: deleteSendingDomain,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "send-sending-domain-setup-instructions",
    description:
      "Email DNS setup instructions for a sending domain to a given address.",
    inputSchema: sendSendingDomainSetupInstructionsSchema,
    handler: sendSendingDomainSetupInstructions,
    annotations: {
      destructiveHint: false,
    },
  },
  {
    name: "list-suppressions",
    description:
      "List or search suppressions. Optionally filter by email. Returns up to 1000 suppressions per call.",
    inputSchema: listSuppressionsSchema,
    handler: listSuppressions,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "delete-suppression",
    description:
      "Delete a suppression by ID. Mailtrap will resume delivery to this email unless it gets suppressed again.",
    inputSchema: deleteSuppressionSchema,
    handler: deleteSuppression,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "list-webhooks",
    description: "List all webhooks for the account.",
    inputSchema: listWebhooksSchema,
    handler: listWebhooks,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-webhook",
    description: "Get a single webhook by ID.",
    inputSchema: getWebhookSchema,
    handler: getWebhook,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "create-webhook",
    description:
      "Create a webhook. The response includes a `signing_secret` for verifying webhook payload signatures — this secret is returned only on creation, so store it now.",
    inputSchema: createWebhookSchema,
    handler: createWebhook,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "update-webhook",
    description:
      "Update a webhook's mutable fields (`url`, `active`, `payload_format`, `event_types`). `webhook_type`, `sending_stream`, and `domain_id` cannot be changed after creation.",
    inputSchema: updateWebhookSchema,
    handler: updateWebhook,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-webhook",
    description:
      "Permanently delete a webhook by ID. Returns the deleted webhook record.",
    inputSchema: deleteWebhookSchema,
    handler: deleteWebhook,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "get-contact",
    description:
      "Get a contact by ID or email address. Returns the full contact record including list memberships, status, and custom fields.",
    inputSchema: getContactSchema,
    handler: getContact,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "create-contact",
    description:
      "Create a new contact. Requires `email`; optionally accepts custom `fields`, `list_ids` to subscribe to, and `unsubscribed` to start in unsubscribed status.",
    inputSchema: createContactSchema,
    handler: createContact,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "update-contact",
    description:
      "Update a contact (identified by ID or email). `list_ids` replaces the membership set; `list_ids_included`/`list_ids_excluded` add/remove without disturbing the rest.",
    inputSchema: updateContactSchema,
    handler: updateContact,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "delete-contact",
    description:
      "Permanently delete a contact by ID or email. Returns the deleted contact record when available.",
    inputSchema: deleteContactSchema,
    handler: deleteContact,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "create-contact-event",
    description:
      "Record a contact event (by `name` + arbitrary `params`) against a contact ID or email. Used to trigger automations.",
    inputSchema: createContactEventSchema,
    handler: createContactEvent,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "list-contact-lists",
    description: "List all contact lists for the account.",
    inputSchema: listContactListsSchema,
    handler: listContactLists,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "get-contact-list",
    description: "Get a contact list by ID.",
    inputSchema: getContactListSchema,
    handler: getContactList,
    annotations: {
      readOnlyHint: true,
    },
  },
  {
    name: "create-contact-list",
    description: "Create a new contact list.",
    inputSchema: createContactListSchema,
    handler: createContactList,
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: "update-contact-list",
    description: "Rename an existing contact list.",
    inputSchema: updateContactListSchema,
    handler: updateContactList,
    annotations: {
      destructiveHint: true,
    },
  },
];

export function createServer(): Server {
  const server = new Server(
    {
      name: CONFIG.MCP_SERVER_NAME,
      version: CONFIG.MCP_SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    }
  );

  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    return tool.handler(request.params.arguments as any);
  });

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [],
    };
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [],
    };
  });

  return server;
}

export async function startServer(server: Server): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Server connected to transport");
}
