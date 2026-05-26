![TypeScript](https://img.shields.io/npm/types/mailtrap?logo=typescript&logoColor=white&label=%20)
[![test](https://github.com/mailtrap/mailtrap-mcp/actions/workflows/main.yml/badge.svg)](https://github.com/mailtrap/mailtrap-mcp/actions/workflows/main.yml)
[![NPM](https://shields.io/npm/v/mcp-mailtrap?logo=npm&logoColor=white)](https://www.npmjs.com/package/mcp-mailtrap)

# MCP Mailtrap Server

An MCP server that provides tools for sending and testing in sandbox via Mailtrap.

## Prerequisites

Before using this MCP server, you need to:

1. [Create a Mailtrap account](https://mailtrap.io/signup)
2. [Verify your domain](https://mailtrap.io/sending/domains)
3. Get your API token from [Mailtrap API settings](https://mailtrap.io/api-tokens)
4. Get your Account ID from [Mailtrap account management](https://mailtrap.io/account-management)

**Required Environment Variables:**

- `MAILTRAP_API_TOKEN` - Required for all functionality
- `MAILTRAP_ACCOUNT_ID` - Required for templates, stats, email logs, sandbox list/show, and sending domains. Optional only for send-email and send-sandbox-email.

**Optional (can be passed as tool parameters instead):**

- `DEFAULT_FROM_EMAIL` - Default sender email when `from` is not provided to send-email or send-sandbox-email. Enables switching sender per call via the `from` parameter.
- `MAILTRAP_TEST_INBOX_ID` - Default test inbox ID for sandbox tools when `test_inbox_id` is not provided. Enables switching between inboxes per call via the `test_inbox_id` parameter.
- `MAILTRAP_SANDBOX_ID` - Default sandbox ID for sandbox tools when `sandbox_id` is not provided. Enables switching between sandboxes per call via the `sandbox_id` parameter.

## Quick Install

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=mailtrap&config=eyJlbnYiOnsiTUFJTFRSQVBfQVBJX1RPS0VOIjoieW91cl9tYWlsdHJhcF9hcGlfdG9rZW4iLCJERUZBVUxUX0ZST01fRU1BSUwiOiJ5b3VyX3NlbmRlckBleGFtcGxlLmNvbSIsIk1BSUxUUkFQX0FDQ09VTlRfSUQiOiJ5b3VyX2FjY291bnRfaWQiLCJNQUlMVFJBUF9URVNUX0lOQk9YX0lEIjoieW91cl90ZXN0X2luYm94X2lkIn0sImNvbW1hbmQiOiJucHggLXkgbWNwLW1haWx0cmFwIn0%3D)

[![Install with Node in VS Code](https://img.shields.io/badge/VS_Code-Node-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=mailtrap&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-mailtrap%22%5D%2C%22env%22%3A%7B%22MAILTRAP_API_TOKEN%22%3A%22%24%7Binput%3AmailtrapApiToken%7D%22%2C%22DEFAULT_FROM_EMAIL%22%3A%22%24%7Binput%3AsenderEmail%7D%22%2C%22MAILTRAP_ACCOUNT_ID%22%3A%22%24%7Binput%3AmailtrapAccountId%7D%22%2C%22MAILTRAP_TEST_INBOX_ID%22%3A%22%24%7Binput%3AmailtrapTestInboxId%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22mailtrapApiToken%22%2C%22description%22%3A%22Mailtrap+API+Token%22%2C%22password%22%3Atrue%7D%2C%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22senderEmail%22%2C%22description%22%3A%22Sender+Email+Address%22%7D%2C%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22mailtrapAccountId%22%2C%22description%22%3A%22Mailtrap+Account+ID%22%7D%2C%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22mailtrapTestInboxId%22%2C%22description%22%3A%22Mailtrap+Test+Inbox+ID+%28optional%29%22%7D%5D)



### Smithery CLI

[Smithery](https://github.com/smithery-ai/cli) is a registry installer and manager for MCP servers that works with all AI clients.

```
npx @smithery/cli install mailtrap
```

> Smithery automatically handles client configuration and provides an interactive setup process. It's the easiest way to get started with MCP servers locally.



## Setup

### Claude Desktop

Use MCPB to install the Mailtrap server. You can find those files in [Releases](https://github.com/mailtrap/mailtrap-mcp/releases). <br>Download .MCPB file and open it. If you have Claude Desktop - it will open it and suggest to configure.

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

## Usage

Once configured, you can ask agent to send emails and manage templates, for example:

**Email Sending Operations:**

- "Send an email to john.doe@example.com with the subject 'Meeting Tomorrow' and a friendly reminder about our upcoming meeting."
- "Email sarah@example.com about the project update, and CC the team at team@example.com"
- "Send the welcome template (uuid `b81aabcd-1a1e-41cf-91b6-eca0254b3d96`) to new@example.com with variables `{ name: 'Alex' }`"
- "Send a sandbox email to test@example.com with subject 'Test Template' to preview how our welcome email looks"

**Email Logs (debug delivery):**

- "List my recent sent email logs"
- "Show email logs for emails sent to user@example.com"
- "Get the email log message for ID abc-123-uuid to check delivery status"

**Sending Statistics:**

- "Get sending stats for January 2025"
- "Show delivery rates broken down by domain for last month"
- "What are my email stats by category from 2025-01-01 to 2025-01-31?"

**Sandbox Operations:**

- "Get all messages from my sandbox inbox"
- "Show me the first page of sandbox messages"
- "Search for messages containing 'test' in my sandbox inbox"
- "Show me the details of sandbox message with ID 5159037506"

**Template Operations:**

- "List all email templates in my Mailtrap account"
- "Create a new email template called 'Welcome Email' with subject 'Welcome to our platform!'"
- "Update the template with ID 12345 to change the subject to 'Updated Welcome Message'"
- "Delete the template with ID 67890"

**Sending Domains:**

- "List my sending domains"
- "Get sending domain with ID 3938"
- "Create a sending domain for example.com"
- "Delete sending domain 3938"
- "Get sending domain 3938 with DNS setup instructions"

## Available Tools

### send-email

Sends a transactional email through Mailtrap. Supports two mutually exclusive modes — **inline content** (`subject` + `text`/`html`) or **template-based** (`template_uuid`).

**Parameters:**

- `from` (optional): Sender as an email string or `{ email, name? }`. If not provided, `DEFAULT_FROM_EMAIL` is used.
- `to` (optional): Recipient(s) — a single email/`{ email, name? }` or an array. Optional if `cc` or `bcc` is provided; at least one of `to` / `cc` / `bcc` must contain a recipient.
- `cc` (optional): Array of CC recipients (email strings or `{ email, name? }` each).
- `bcc` (optional): Array of BCC recipients (email strings or `{ email, name? }` each).
- `subject` (conditional): Email subject line. Required for inline sends; must be omitted when `template_uuid` is set.
- `text` (conditional): Email body text. Required (alongside or instead of `html`) for inline sends; must be omitted when `template_uuid` is set.
- `html` (conditional): HTML version of the email body. Required (alongside or instead of `text`) for inline sends; must be omitted when `template_uuid` is set.
- `category` (optional): Email category for tracking and analytics. Must be omitted when `template_uuid` is set.
- `template_uuid` (optional): Use a Mailtrap email template instead of inline content. When set, `subject` / `text` / `html` / `category` must be omitted (per Mailtrap API).
- `template_variables` (optional): Object of variables substituted into the template referenced by `template_uuid`. Only allowed together with `template_uuid`.

### list-email-logs

Lists sent email logs (delivery history) with optional pagination and filters. Use to debug delivery issues from the IDE.

**Parameters:**

- `search_after` (optional): Pagination cursor from the previous response's `next_page_cursor`
- `sent_after` (optional): ISO 8601 date/time; only logs sent after this time
- `sent_before` (optional): ISO 8601 date/time; only logs sent before this time
- `from_email` (optional): Filter by sender email; use with `from_operator` (default: ci_equal)
- `to_email` (optional): Filter by recipient email; use with `to_operator` (default: ci_equal)
- `status` (optional): Filter by delivery status: delivered, not_delivered, enqueued, opted_out; use with `status_operator` (default: equal)
- `subject` (optional): Filter by email subject; use with `subject_operator` (default: ci_contain). Use `subject_operator`: empty/not_empty to filter by presence of subject.
- `sending_domain_id` (optional): Filter by sending domain ID (number); use with `sending_domain_id_operator` (default: equal)
- `sending_stream` (optional): Filter by stream: transactional or bulk; use with `sending_stream_operator` (default: equal)
- `events` (optional): Filter by event type(s): delivery, open, click, bounce, spam, unsubscribe, soft_bounce, reject, suspension; use with `events_operator` (include_event / not_include_event)
- `clicks_count` / `opens_count` (optional): Filter by click/open count; use with `*_operator`: equal, greater_than, less_than
- `client_ip` / `sending_ip` (optional): Filter by IP; use with `*_operator`: equal, not_equal, contain, not_contain
- `email_service_provider_response` (optional): Filter by provider response text; use with `*_operator` (ci_contain, etc.)
- `email_service_provider` (optional): Filter by provider (exact); use with `*_operator`: equal, not_equal
- `recipient_mx` (optional): Filter by recipient MX; use with `recipient_mx_operator` (ci_contain, etc.)
- `category` (optional): Filter by email category; use with `category_operator`: equal, not_equal

All parameters are optional.

### get-email-log-message

Gets a single email log message by ID (UUID): a readable summary (from, to, subject, sent time, status, category, stream, engagement, delivery context), then detailed event history. Optionally, with `include_content: true`, you can also load and show the message body (HTML and plain text) when Mailtrap exposes a raw message URL.

**Parameters:**

- `message_id` (required): UUID of the email log message (from send response or list-email-logs). Use `list-email-logs` to find message IDs.
- `include_content` (optional): When `true`, fetches the raw EML (if `raw_message_url` is available) and appends parsed HTML and plain-text body sections, similar to show-sandbox-email-message.

### get-sending-stats

Get email sending statistics (delivery, bounce, open, click, spam rates) for a date range. Optionally break down by domain, category, email service provider, or date. Check delivery rates without leaving the editor.

**Parameters:**

- `start_date` (required): Start date for the stats range (YYYY-MM-DD)
- `end_date` (required): End date for the stats range (YYYY-MM-DD)
- `breakdown` (optional): How to break down the stats: `aggregated` (default), `by_domain`, `by_category`, `by_email_service_provider`, or `by_date`
- `sending_domain_ids` (optional): Limit results to these sending domain IDs (array of integers)
- `sending_streams` (optional): Limit to `transactional` and/or `bulk` (array of strings)
- `categories` (optional): Limit to these email categories (array of strings)
- `email_service_providers` (optional): Limit to these providers, e.g. Google, Yahoo, Outlook (array of strings)

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

### get-template

Get a single email template by ID, including subject, category, and HTML/text body.

**Parameters:**

- `template_id` (required): ID of the template to fetch

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

### send-sandbox-email

Sends an email to your Mailtrap test inbox for development and testing purposes. This is perfect for testing email templates without sending emails to real recipients. Supports the same two modes as `send-email` — **inline content** or **template-based** (`template_uuid`).

**Parameters:**

- `test_inbox_id` (optional): Mailtrap test inbox ID. Required unless `MAILTRAP_TEST_INBOX_ID` is set; pass per call to target a specific inbox.
- `from` (optional): Sender as an email string or `{ email, name? }`. If not provided, `DEFAULT_FROM_EMAIL` is used.
- `to` (optional): Recipients as a comma-separated string, or an array of email strings / `{ email, name? }` objects. Optional if `cc` or `bcc` is provided; at least one of `to` / `cc` / `bcc` must contain a recipient.
- `cc` (optional): Array of CC recipients (email strings or `{ email, name? }` each).
- `bcc` (optional): Array of BCC recipients (email strings or `{ email, name? }` each).
- `subject` (conditional): Email subject line. Required for inline sends; must be omitted when `template_uuid` is set.
- `text` (conditional): Email body text. Required (alongside or instead of `html`) for inline sends; must be omitted when `template_uuid` is set.
- `html` (conditional): HTML version of the email body. Required (alongside or instead of `text`) for inline sends; must be omitted when `template_uuid` is set.
- `category` (optional): Email category for tracking. Must be omitted when `template_uuid` is set.
- `template_uuid` (optional): Use a Mailtrap email template instead of inline content. When set, `subject` / `text` / `html` / `category` must be omitted.
- `template_variables` (optional): Object of variables substituted into the template referenced by `template_uuid`. Only allowed together with `template_uuid`.

> [!NOTE]
> For sandbox tools, provide `test_inbox_id` in the tool call or set the `MAILTRAP_TEST_INBOX_ID` environment variable. You can switch between inboxes per call by passing `test_inbox_id`.

### get-sandbox-messages

Retrieves a list of messages from your Mailtrap test inbox. Useful for checking what emails have been received in your sandbox during testing.

**Parameters:**

- `page` (optional): Page number for pagination (minimum: 1)
- `last_id` (optional): Pagination using last message ID. Returns messages after the specified message ID (minimum: 1)
- `search` (optional): Search query to filter messages

> [!NOTE]
> All parameters are optional. If none are provided, the first page of messages from the inbox will be returned. Use page for traditional pagination, last_id for cursor-based pagination, or search to filter messages by content.

### show-sandbox-email-message

Shows detailed information and content of a specific email message from your Mailtrap test inbox, including HTML and text body content.

**Parameters:**

- `message_id` (required): ID of the sandbox email message to retrieve

> [!NOTE]
> Use `get-sandbox-messages` first to get the list of messages and their IDs, then use this tool to view the full content of a specific message.


### get-sandbox-project

Get a sandbox project by ID, including its inboxes and email counts.

**Parameters:**

- `project_id` (required): ID of the project to fetch

### update-sandbox-project

Rename an existing sandbox project.

**Parameters:**

- `project_id` (required): ID of the project to update
- `name` (required): New name for the project (2–100 characters)

### list-sandboxes

List every sandbox accessible to the API token across all projects.

**Parameters:**

- No parameters required

### mark-sandbox-as-read

Mark all messages in a sandbox as read.

**Parameters:**

- `sandbox_id` (required): ID of the sandbox to act on

### reset-sandbox-credentials

Reset the SMTP credentials for a sandbox. Returns the new username/password.

**Parameters:**

- `sandbox_id` (required): ID of the sandbox to act on

### enable-sandbox-email-address

Enable the receive-by-email address for a sandbox (turns on the Mailtrap address that delivers messages to the sandbox via SMTP).

**Parameters:**

- `sandbox_id` (required): ID of the sandbox to act on

### reset-sandbox-email-address

Generate a new receive-by-email address for a sandbox.

**Parameters:**

- `sandbox_id` (required): ID of the sandbox to act on

### forward-sandbox-message

Forward a sandbox message to an external email address. Counts against your monthly forwarding quota.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message to forward
- `email` (required): Email address to forward the message to

### update-sandbox-message

Mark a sandbox message as read or unread.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message to update
- `is_read` (required): `true` marks as read, `false` marks as unread

### delete-sandbox-message

Delete a single sandbox message.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message to delete

### get-sandbox-message-spam-score

Get the SpamAssassin spam report for a sandbox message (score, rules, full report). Standalone alternative to `include_spam_report: true` on `show-sandbox-email-message`.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-html-analysis

Get the HTML analysis report for a sandbox message (client compatibility scores, problematic elements). Standalone alternative to `include_html_analysis: true` on `show-sandbox-email-message`.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-headers

Get the parsed mail headers for a sandbox message.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-html

Get the rendered HTML body of a sandbox message.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-text

Get the plain-text body of a sandbox message.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-raw

Get the raw, MIME-formatted message (headers + body) for a sandbox message.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-eml

Get the message rendered as an EML file payload (suitable for attaching to a ticket or importing into another mail client).

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-message-html-source

Get the unrendered HTML source of a sandbox message (HTML before any Mailtrap-side transformations like CID-link rewrites).

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### list-sandbox-attachments

List all attachments on a sandbox message (filename, content type, size, download path).

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message

### get-sandbox-attachment

Get metadata and download URL for a single attachment.

**Parameters:**

- `sandbox_id` (optional): Sandbox ID. Falls back to `MAILTRAP_SANDBOX_ID`.
- `message_id` (required): ID of the sandbox message that contains the attachment
- `attachment_id` (required): ID of the attachment to fetch

### list-sending-domains

List sending domains and their DNS verification status.

**Parameters:**

- No parameters required

### get-sending-domain

Get a sending domain by ID and its verification status (including DNS records). Optionally include DNS setup instructions by setting `include_setup_instructions` to `true`.

**Parameters:**

- `sending_domain_id` (required): Sending domain ID
- `include_setup_instructions` (optional): If `true`, append DNS setup instructions to the response. Default: `false`

### create-sending-domain

Create a new sending domain. After creation, add DNS records to verify the domain (use get-sending-domain with `include_setup_instructions: true` to see the records).

**Parameters:**

- `domain_name` (required): Domain name (e.g. example.com)

### delete-sending-domain

Delete a sending domain.

**Parameters:**

- `sending_domain_id` (required): Sending domain ID to delete

### send-sending-domain-setup-instructions

Email DNS setup instructions for a sending domain to a given address. Useful for forwarding DNS records to a DevOps teammate.

**Parameters:**

- `sending_domain_id` (required): Sending domain ID
- `email` (required): Email address to send DNS setup instructions to

### list-suppressions

List or search suppressions (hard bounces, spam complaints, unsubscriptions, manual imports). Returns up to 1000 results per call.

**Parameters:**

- `email` (optional): Email filter. Returns only suppressions matching this address.

### delete-suppression

Delete a suppression by ID. Mailtrap will resume delivery to this email unless it gets suppressed again.

**Parameters:**

- `suppression_id` (required): ID of the suppression to delete

### list-webhooks

List all webhooks configured for the account. Returns the full webhook records as JSON.

**Parameters:**

- No parameters required

### get-webhook

Get a single webhook by ID. Returns the full webhook record as JSON. Note: `signing_secret` is **not** returned here — it is only available in the response from `create-webhook`.

**Parameters:**

- `webhook_id` (required): ID of the webhook to fetch

### create-webhook

Create a webhook. The response includes a `signing_secret` for verifying webhook payload signatures — this secret is returned **only on creation**, so store it now. If you lose it, recreate the webhook.

**Parameters:**

- `url` (required): URL Mailtrap will POST webhook events to
- `webhook_type` (required): `"email_sending"` or `"audit_log"`
- `active` (optional, boolean): defaults to `true`
- `payload_format` (optional): `"json"` or `"jsonlines"`. Defaults to `"json"`
- `sending_stream` (optional, `email_sending` only): `"transactional"` or `"bulk"`
- `event_types` (optional, `email_sending` only): array of `delivery`, `soft_bounce`, `bounce`, `suspension`, `unsubscribe`, `open`, `spam_complaint`, `click`, `reject`
- `domain_id` (optional, `email_sending` only): sending domain ID to scope this webhook to

### update-webhook

Update a webhook's mutable fields. `webhook_type`, `sending_stream`, and `domain_id` cannot be changed after creation — recreate the webhook if you need to change those.

**Parameters:**

- `webhook_id` (required): ID of the webhook to update
- `url` (optional): New webhook URL
- `active` (optional, boolean): Enable or disable the webhook
- `payload_format` (optional): `"json"` or `"jsonlines"`
- `event_types` (optional, `email_sending` only): array of `delivery`, `soft_bounce`, `bounce`, `suspension`, `unsubscribe`, `open`, `spam_complaint`, `click`, `reject`

### delete-webhook

Permanently delete a webhook by ID. Returns the deleted webhook record.

**Parameters:**

- `webhook_id` (required): ID of the webhook to delete

### get-contact

Get a contact by ID or email. Returns the full contact record (list memberships, status, custom fields).

**Parameters:**

- `contact_identifier` (required): Contact ID or email address

### create-contact

Create a new contact.

**Parameters:**

- `email` (required): Email address
- `fields` (optional): Custom field values keyed by merge tag (e.g. `first_name`). String, number, or boolean values
- `list_ids` (optional): IDs of contact lists to subscribe this contact to
- `unsubscribed` (optional, boolean): Create the contact in `unsubscribed` status

### update-contact

Update an existing contact identified by ID or email. `list_ids` replaces the contact's full membership set; `list_ids_included`/`list_ids_excluded` add/remove without disturbing the rest.

**Parameters:**

- `contact_identifier` (required): Contact ID or email
- `email` (optional): New email address
- `fields` (optional): Custom field values keyed by merge tag
- `list_ids` (optional): Replace membership set with this exact list
- `list_ids_included` (optional): List IDs to add (additive)
- `list_ids_excluded` (optional): List IDs to remove
- `unsubscribed` (optional, boolean): Set to `unsubscribed` (true) or `subscribed` (false)

### delete-contact

Permanently delete a contact by ID or email. Returns the deleted contact record when the API responds with one; otherwise returns a confirmation payload.

**Parameters:**

- `contact_identifier` (required): Contact ID or email

### create-contact-event

Record a contact event against a contact (by ID or email). Used to trigger contact-list automations.

**Parameters:**

- `contact_identifier` (required): Contact ID or email
- `name` (required): Event name (matches automation triggers)
- `params` (required): Object of arbitrary key/value pairs. Values may be string, number, boolean, or null

## Development

1. Clone the repository:

```bash
git clone https://github.com/mailtrap/mailtrap-mcp.git
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

### Running tools against real Mailtrap

There are two ways to exercise a tool end-to-end against a real Mailtrap account: the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) browser UI for interactive exploration, or its CLI mode for one-shot calls from the shell.

Both require the bundle to be built first:

```bash
npm run build
```

and `MAILTRAP_API_TOKEN` + `MAILTRAP_ACCOUNT_ID` exported in your shell (the `mcp:cli` script forwards both to the spawned server). 

#### Browser UI

```bash
npm run dev
```

The Inspector prints a URL like `http://localhost:6274`. Open it, switch to the **Tools** tab, pick a tool (e.g. `get-template`), fill the parameters as JSON, and hit **Run**. The Mailtrap response appears in the panel below.

#### CLI

For one-shot calls without the UI, use `npm run mcp:cli`. Pass the Inspector's CLI flags after `--` so npm forwards them verbatim:

```bash
# List all tools
npm run mcp:cli -- --method tools/list

# Call a tool — flags after the `--`
npm run mcp:cli -- \
  --method tools/call \
  --tool-name get-template \
  --tool-arg template_id=12345

# Multiple --tool-arg flags for tools with several params
npm run mcp:cli -- \
  --method tools/call \
  --tool-name send-sending-domain-setup-instructions \
  --tool-arg sending_domain_id=3938 \
  --tool-arg email=devops@example.com
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
2. Sandbox not working: provide `test_inbox_id` in the tool call or set `MAILTRAP_TEST_INBOX_ID` env
3. Timeout errors: check network connectivity and Mailtrap API status
4. Validation errors: ensure all required fields are provided

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/mailtrap/mailtrap-mcp). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Mailtrap project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
