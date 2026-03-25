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
} from "./tools/sendingDomains";

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
