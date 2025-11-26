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
- Each tool has its own subdirectory (e.g., `sendEmail/`, `templates/`)
- Tools export both their implementation function and Zod schema for validation
- Template operations are grouped under `templates/` with individual files for each CRUD operation

### Tool Structure Pattern
```
src/tools/{toolName}/
├── index.ts          # Main tool export
├── schema.ts         # Zod validation schema
├── {toolName}.ts     # Tool implementation
└── __tests__/        # Jest test files
```

### Environment Variables Required
- `MAILTRAP_API_TOKEN`: Required API token from Mailtrap
- `DEFAULT_FROM_EMAIL`: Default sender email address
- `MAILTRAP_ACCOUNT_ID`: Optional account ID for multi-account setups
- `MAILTRAP_TEST_INBOX_ID`: Required for sandbox tools - test inbox ID for sandbox mode operations

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
1. **send-email**: Send transactional emails through Mailtrap

#### Email Templates
2. **create-template**: Create new email templates
3. **list-templates**: List all email templates
4. **update-template**: Update existing email templates
5. **delete-template**: Delete email templates

#### Sandbox Testing
6. **send-sandbox-email**: Send email in sandbox mode to a test inbox
7. **get-sandbox-messages**: Get list of messages from the sandbox test inbox
8. **show-sandbox-email-message**: Show sandbox email message details and content from the sandbox test inbox

Each tool uses Zod schemas for input validation and follows the MCP protocol for response formatting.
