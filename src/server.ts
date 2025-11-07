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
import { sendSandboxEmail, sendSandboxEmailSchema } from "./tools/sandbox";

// Define the tools registry
const tools = [
  {
    name: "send-email",
    description: "Send an email to your recipient email address using Mailtrap Email API. You can send emails to multiple recipients at once.",
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
    description: "Send an email in sandbox mode to a test inbox without delivering to your recipients",
    inputSchema: sendSandboxEmailSchema,
    handler: sendSandboxEmail,
    annotations: {
      destructiveHint: false,
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
