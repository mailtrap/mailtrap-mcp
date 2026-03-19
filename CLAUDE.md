# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development

- `npm run build` - Compile TypeScript to JavaScript in the `dist/` directory
- `npm run dev` - Run the MCP server with the MCP Inspector for testing
- `npm run prepublish` - Build the project and make the executable script executable

### Code Quality

- `npm run lint` - Run both ESLint and TypeScript checks
- `npm run lint:eslint` - Run ESLint for code style checking
- `npm run lint:tsc` - Run TypeScript compiler for type checking

### Testing

- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode during development
- `npm run test:coverage` - Run tests with coverage reporting

## Project Architecture

This is an MCP (Model Context Protocol) server that integrates with Mailtrap's email service. The architecture follows a modular pattern:

### Core Components

- **src/index.ts**: Main MCP server entry point that registers all tools and handles the server lifecycle
- **src/client.ts**: Mailtrap client configuration and initialization
- **src/config/index.ts**: Server configuration constants

### Tool Architecture

All tools follow a consistent pattern in the `src/tools/` directory:

- Each tool (or tool group) has its own subdirectory (e.g., `sendEmail/`, `templates/`, `emailLogs/`)
- Tools export an **input schema** (JSON Schema–style object for MCP `inputSchema`) and a **handler** function
- Template operations are grouped under `templates/` with individual files for each CRUD operation
- **Runtime validation**: Handlers may validate input with Zod (see `stats/schema.ts` and `getSendingStats.ts`). Other tools use TypeScript types and ad-hoc checks; adding Zod validation in handlers is recommended for consistency

### Tool Structure Pattern

- Single-tool dirs (e.g. `sendEmail/`, `stats/`): `index.ts`, `schema.ts` (or `schema.ts` + Zod in handler), implementation file(s), `__tests__/`
- Multi-tool dirs (e.g. `templates/`, `sandbox/`, `emailLogs/`): `index.ts`, `schemas/*.ts` (one schema per tool), implementation file(s), `__tests__/`

Schema files define a JSON Schema–shaped object for MCP; optional Zod schemas in the same or separate file can be used for runtime validation in the handler.

### Environment Variables Required

- `MAILTRAP_API_TOKEN`: Required API token from Mailtrap
- `MAILTRAP_ACCOUNT_ID`: Required for templates, stats, email logs, sandbox list/show, and sending domains. Optional only for send-email and send-sandbox-email.
- `DEFAULT_FROM_EMAIL`: Optional. Default sender email when the tool does not receive a `from` parameter (send-email, send-sandbox-email).
- `MAILTRAP_TEST_INBOX_ID`: Optional. Default test inbox ID for sandbox tools when the tool does not receive a `test_inbox_id` parameter. Enables switching inboxes per call via parameters.

### Testing Setup

- Uses Jest with TypeScript support via ts-jest
- Test files are located in `__tests__/` directories within each tool
- Environment variables are set up via `jest/setEnvVars.js`
- Coverage reports exclude test files and type definitions

### Build Configuration

- TypeScript compilation targets ES2022 with CommonJS modules
- Separate build config (`tsconfig.build.json`) excludes test files from distribution
- Output goes to `dist/` directory with proper executable permissions

### Available MCP Tools

#### Transactional Email

- **send-email**: Send transactional emails through Mailtrap.

#### Email Logs

- **list-email-logs**: List sent email logs (delivery history) with optional pagination and filters; use to debug delivery issues.
- **get-email-log-message**: Get a single email log message by ID (UUID) to inspect delivery status and event history; optional `include_content` loads message body when available.

#### Statistics

- **get-sending-stats**: Get email sending statistics (delivery, bounce, open, click, spam rates) for a date range; optionally break down by domain, category, email service provider, or date.

#### Email Templates

- **create-template**: Create new email templates.
- **list-templates**: List all email templates.
- **update-template**: Update existing email templates.
- **delete-template**: Delete email templates.

#### Sandbox Testing

- **send-sandbox-email**: Send email in sandbox mode to a test inbox.
- **get-sandbox-messages**: Get list of messages from the sandbox test inbox.
- **show-sandbox-email-message**: Show sandbox email message details and content from the sandbox test inbox.


#### Sending Domains

- **list-sending-domains**: List sending domains and their DNS verification status.
- **get-sending-domain**: Get a sending domain by ID and its verification status. With `include_setup_instructions: true`, append DNS setup instructions to the response.
- **create-sending-domain**: Create a new sending domain.
- **delete-sending-domain**: Delete a sending domain.

Tools use input schemas (JSON Schema format) for MCP; handlers may validate input with Zod. Response format follows the MCP protocol.
