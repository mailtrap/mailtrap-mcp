![TypeScript](https://img.shields.io/npm/types/mailtrap?logo=typescript&logoColor=white&label=%20)
[![test](https://github.com/railsware/mailtrap-mcp/actions/workflows/main.yml/badge.svg)](https://github.com/railsware/mailtrap-mcp/actions/workflows/main.yml)
[![NPM](https://shields.io/npm/v/mcp-mailtrap?logo=npm&logoColor=white)](https://www.npmjs.com/package/mcp-mailtrap)

# MCP Mailtrap Server

An MCP server that provides tools for sending transactional emails and managing email templates via Mailtrap

## Prerequisites

Before using this MCP server, you need to:

1. [Create a Mailtrap account](https://mailtrap.io/signup)
2. [Verify your domain](https://mailtrap.io/sending/domains)
3. Get your API token from [Mailtrap API settings](https://mailtrap.io/api-tokens)
4. Get your Account ID from [Mailtrap account management](https://mailtrap.io/account-management)

**Required Environment Variables:**
- `MAILTRAP_API_TOKEN` - Required for all functionality
- `DEFAULT_FROM_EMAIL` - Required for all email sending operations
- `MAILTRAP_ACCOUNT_ID` - Required for template management operations
- `MAILTRAP_TEST_INBOX_ID` - **Only** required for sandbox email functionality

## Quick Install

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=mailtrap&config=eyJjb21tYW5kIjoibnB4IC15IG1jcC1tYWlsdHJhcCIsImVudiI6eyJNQUlMVFJBUF9BUElfVE9LRU4iOiJ5b3VyX21haWx0cmFwX2FwaV90b2tlbiIsIkRFRkFVTFRfRlJPTV9FTUFJTCI6InlvdXJfc2VuZGVyQGV4YW1wbGUuY29tIiwiTUFJTFRSQVBfQUNDT1VOVF9JRCI6InlvdXJfYWNjb3VudF9pZCJ9fQ%3D%3D)

[![Install with Node in VS Code](https://img.shields.io/badge/VS_Code-Node-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=mailtrap&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-mailtrap%22%5D%2C%22env%22%3A%7B%22MAILTRAP_API_TOKEN%22%3A%22%24%7Binput%3AmailtrapApiToken%7D%22%2C%22DEFAULT_FROM_EMAIL%22%3A%22%24%7Binput%3AsenderEmail%7D%22%2C%22MAILTRAP_ACCOUNT_ID%22%3A%22%24%7Binput%3AmailtrapAccountId%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22mailtrapApiToken%22%2C%22description%22%3A%22Mailtrap+API+Token%22%2C%22password%22%3Atrue%7D%2C%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22senderEmail%22%2C%22description%22%3A%22Sender+Email+Address%22%7D%2C%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22mailtrapAccountId%22%2C%22description%22%3A%22Mailtrap+Account+ID%22%7D%5D)

### MCP Bundle (MCPB)

For easy installation in hosts that support MCP Bundles, you can distribute an `.mcpb` bundle file.

```bash
# Build TypeScript and pack the MCPB bundle
npm run mcpb:pack

# Inspect bundle metadata
npm run mcpb:info

# Sign the bundle for distribution (optional)
npm run mcpb:sign
```

This creates `mailtrap-mcp.mcpb` using the repository `manifest.json` and built artifacts in `dist/`.

## Setup

### Claude Desktop or Cursor

Add the following configuration:

```json
{
  "mcpServers": {
    "mailtrap": {
      "command": "npx",
      "args": ["-y", "mcp-mailtrap"],
      "env": {
        "MAILTRAP_API_TOKEN": "your_mailtrap_api_token",
        "DEFAULT_FROM_EMAIL": "your_sender@example.com",
        "MAILTRAP_ACCOUNT_ID": "your_account_id",
        "MAILTRAP_TEST_INBOX_ID": "your_test_inbox_id"
      }
    }
  }
}
```

If you are using `asdf` for managing Node.js you must use absolute path to executable (example for Mac)

```json
{
  "mcpServers": {
    "mailtrap": {
      "command": "/Users/<username>/.asdf/shims/npx",
      "args": ["-y", "mcp-mailtrap"],
      "env": {
        "PATH": "/Users/<username>/.asdf/shims:/usr/bin:/bin",
        "ASDF_DIR": "/opt/homebrew/opt/asdf/libexec",
        "ASDF_DATA_DIR": "/Users/<username>/.asdf",
        "ASDF_NODEJS_VERSION": "20.6.1",
        "MAILTRAP_API_TOKEN": "your_mailtrap_api_token",
        "DEFAULT_FROM_EMAIL": "your_sender@example.com",
        "MAILTRAP_ACCOUNT_ID": "your_account_id",
        "MAILTRAP_TEST_INBOX_ID": "your_test_inbox_id"
      }
    }
  }
}
```

#### Claude Desktop config file location

**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Cursor config file location

**Mac**: `~/.cursor/mcp.json`

**Windows**: `%USERPROFILE%\.cursor\mcp.json`

### VS Code




#### Manually changing config

Run in Command Palette: `Preferences: Open User Settings (JSON)`

Then, in the settings file, add the following configuration:

```json
{
  "mcp": {
    "servers": {
      "mailtrap": {
        "command": "npx",
        "args": ["-y", "mcp-mailtrap"],
        "env": {
          "MAILTRAP_API_TOKEN": "your_mailtrap_api_token",
          "DEFAULT_FROM_EMAIL": "your_sender@example.com",
          "MAILTRAP_ACCOUNT_ID": "your_account_id",
          "MAILTRAP_TEST_INBOX_ID": "your_test_inbox_id"
        }
      }
    }
  }
}
```

> [!TIP]
> Don't forget to restart your MCP server after changing the "env" section.

## Usage

Once configured, you can ask agent to send emails and manage templates, for example:

**Email Operations:**

- "Send an email to john.doe@example.com with the subject 'Meeting Tomorrow' and a friendly reminder about our upcoming meeting."
- "Email sarah@example.com about the project update, and CC the team at team@example.com"
- "Send a sandbox email to test@example.com with subject 'Test Template' to preview how our welcome email looks"

**Template Operations:**

- "List all email templates in my Mailtrap account"
- "Create a new email template called 'Welcome Email' with subject 'Welcome to our platform!'"
- "Update the template with ID 12345 to change the subject to 'Updated Welcome Message'"
- "Delete the template with ID 67890"

## Available Tools

### send-email

Sends a transactional email through Mailtrap.

**Parameters:**

- `to` (required): Email address(es) of the recipient(s) - can be a single email or array of emails
- `subject` (required): Email subject line
- `from` (optional): Email address of the sender, if not provided "DEFAULT_FROM_EMAIL" will be used
- `text` (optional): Email body text, required if "html" is empty
- `html` (optional): HTML version of the email body, required if "text" is empty
- `cc` (optional): Array of CC recipient email addresses
- `bcc` (optional): Array of BCC recipient email addresses
- `category` (required): Email category for tracking and analytics

### send-sandbox-email

Sends an email to your Mailtrap test inbox for development and testing purposes. This is perfect for testing email templates without sending emails to real recipients.

**Parameters:**

- `to` (required): Email address(es) of the recipient(s) - can be a single email or array of emails (will be delivered to your test inbox)
- `subject` (required): Email subject line
- `from` (optional): Email address of the sender, if not provided "DEFAULT_FROM_EMAIL" will be used
- `text` (optional): Email body text, required if "html" is empty
- `html` (optional): HTML version of the email body, required if "text" is empty
- `cc` (optional): Array of CC recipient email addresses
- `bcc` (optional): Array of BCC recipient email addresses
- `category` (optional): Email category for tracking

> [!NOTE]
> The `MAILTRAP_TEST_INBOX_ID` environment variable must be configured for sandbox emails to work. This variable is **only** required for sandbox functionality and is not needed for regular transactional emails or template management.

### create-template

Creates a new email template in your Mailtrap account.

**Parameters:**

- `name` (required): Name of the template
- `subject` (required): Email subject line
- `html` (or `text` is required): HTML content of the template
- `text` (or `html` is required): Plain text version of the template
- `category` (optional): Template category (defaults to "General")

### list-templates

Lists all email templates in your Mailtrap account.

**Parameters:**

- No parameters required

### update-template

Updates an existing email template.

**Parameters:**

- `template_id` (required): ID of the template to update
- `name` (optional): New name for the template
- `subject` (optional): New email subject line
- `html` (optional): New HTML content of the template
- `text` (optional): New plain text version of the template
- `category` (optional): New category for the template

> [!NOTE]
> At least one updatable field (name, subject, html, text, or category) must be provided when calling update-template to perform an update.

### delete-template

Deletes an existing email template.

**Parameters:**

- `template_id` (required): ID of the template to delete

## Development

1. Clone the repository:

```bash
git clone https://github.com/railsware/mailtrap-mcp.git
cd mailtrap-mcp
```

2. Install dependencies:

```bash
npm install
```

### Configuration with Claude Desktop or Cursor

> [!TIP]
> See the location of the config file in the [Setup](#setup) section.

Add the following configuration:

```json
{
  "mcpServers": {
    "mailtrap": {
      "command": "node",
      "args": ["/path/to/mailtrap-mcp/dist/index.js"],
      "env": {
        "MAILTRAP_API_TOKEN": "your_mailtrap_api_token",
        "DEFAULT_FROM_EMAIL": "your_sender@example.com",
        "MAILTRAP_ACCOUNT_ID": "your_account_id",
        "MAILTRAP_TEST_INBOX_ID": "your_test_inbox_id"
      }
    }
  }
}
```

If you are using `asdf` for managing Node.js you should use absolute path to executable:

(example for Mac)

```json
{
  "mcpServers": {
    "mailtrap": {
      "command": "/Users/<username>/.asdf/shims/node",
      "args": ["/path/to/mailtrap-mcp/dist/index.js"],
      "env": {
        "PATH": "/Users/<username>/.asdf/shims:/usr/bin:/bin",
        "ASDF_DIR": "/opt/homebrew/opt/asdf/libexec",
        "ASDF_DATA_DIR": "/Users/<username>/.asdf",
        "ASDF_NODEJS_VERSION": "20.6.1",
        "MAILTRAP_API_TOKEN": "your_mailtrap_api_token",
        "DEFAULT_FROM_EMAIL": "your_sender@example.com",
        "MAILTRAP_ACCOUNT_ID": "your_account_id",
        "MAILTRAP_TEST_INBOX_ID": "your_test_inbox_id"
      }
    }
  }
}
```

### VS Code

> [!TIP]
> See the location of the config file in the [Setup](#setup) section.

```json
{
  "mcp": {
    "servers": {
      "mailtrap": {
        "command": "node",
        "args": ["/path/to/mailtrap-mcp/dist/index.js"],
        "env": {
          "MAILTRAP_API_TOKEN": "your_mailtrap_api_token",
          "DEFAULT_FROM_EMAIL": "your_sender@example.com",
          "MAILTRAP_ACCOUNT_ID": "your_account_id",
          "MAILTRAP_TEST_INBOX_ID": "your_test_inbox_id"
        }
      }
    }
  }
}
```

## Testing

You can test the server using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run dev
```

### Running the MCPB Server

```bash
# Run the MCPB server directly
node dist/mcpb-server.js

# Or use the provided binary
mailtrap-mcpb-server
```

> [!TIP]
> For development with the MCP Inspector:

```bash
npm run dev:mcpb
```

## Error Handling

This server uses structured error handling aligned with MCP conventions:

- `VALIDATION_ERROR`: Input validation failures
- `CONFIGURATION_ERROR`: Missing or invalid configuration
- `EXECUTION_ERROR`: Runtime execution errors
- `TIMEOUT`: Operation timeout (30 seconds default)

Errors include actionable messages and are logged in structured form.

## Security

- Input validated via Zod schemas
- Environment variables handled securely
- Timeout protection on operations (30 seconds)
- Sensitive details sanitized in error output

## Logging

Structured JSON logs with levels: INFO, WARN, ERROR, DEBUG.

Enable debug logging by setting `DEBUG=true`.

```bash
# Example: enable debug logging
DEBUG=true node dist/mcpb-server.js
```

> Important: The server writes logs to stderr so stdout remains reserved for JSON-RPC frames. This prevents hosts from encountering JSON parsing errors due to interleaved logs.

Log analysis example using `jq`:

```bash
# Filter error logs
node dist/mcpb-server.js 2>&1 | jq 'select(.level == "error")'

# Filter debug logs
node dist/mcpb-server.js 2>&1 | jq 'select(.level == "debug")'
```

## Troubleshooting

Common issues:

1. Missing API Token: ensure `MAILTRAP_API_TOKEN` is set
2. Sandbox not working: verify `MAILTRAP_TEST_INBOX_ID` is configured
3. Timeout errors: check network connectivity and Mailtrap API status
4. Validation errors: ensure all required fields are provided

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/railsware/mailtrap-mcp). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Mailtrap project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
