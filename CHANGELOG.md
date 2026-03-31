## [Unreleased]

## [0.3.0] - 2026-03-31

* Support optional **display names** on `from`, `to`, `cc`, and `bcc` for **send-email** and **send-sandbox-email** (addresses can be plain email or `Name <email@example.com>` style). See https://github.com/mailtrap/mailtrap-mcp/pull/72
* Resolve **npm audit** findings; refresh **package-lock.json** accordingly. See https://github.com/mailtrap/mailtrap-mcp/pull/73
* Add npm **overrides** for `minimatch` and `tmp`; bump **@anthropic-ai/mcpb** dev dependency from 1.1.1 to 2.1.2.

## [0.2.0] - 2026-03-30

* Add **sandbox project & inbox management** tools: **list-sandbox-projects**, **create-sandbox-project**, **delete-sandbox-project**, **create-sandbox-inbox**, **get-sandbox-inbox**, **update-sandbox-inbox**, **delete-sandbox-inbox**, **clean-sandbox-inbox**.
* Extend **show-sandbox-email-message** tool with spam report (SpamAssassin score) and HTML analysis (client compatibility).
* Add read-only annotations to **get-sandbox-messages** and **show-sandbox-email-message**.
* Add **list-email-logs** and **get-email-log-message** tools: query sent-mail delivery history with filters and pagination; inspect a single log by UUID (summary, event timeline, optional body via `include_content`).
* Add **get-sending-stats** tool: check delivery, bounce, open, click, and spam rates for a date range; optional breakdown by domain, category, email service provider, or date.
* Add **sending domains** tools: **list-sending-domains**, **get-sending-domain**, **create-sending-domain**, **delete-sending-domain**. **get-sending-domain** accepts optional `include_setup_instructions: true` to append DNS setup instructions to the response.
* Make `DEFAULT_FROM_EMAIL` and `MAILTRAP_TEST_INBOX_ID` config/env params optional so that it's possible to change them in runtime.
* Reuse `requireClient` helper to reduce client setup validation boilerplate across tools.
* Bump `mailtrap` SDK to 4.5.1.
* Update manifest.json tools list to reflect all 23 available tools.
* Dependency updates.

## [0.1.0] - 2025-12-09

* Adjust some info by @yanchuk in https://github.com/mailtrap/mailtrap-mcp/pull/41
* chore(deps-dev): bump js-yaml from 3.14.1 to 3.14.2 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/43
* chore(deps): bump body-parser from 2.2.0 to 2.2.1 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/45
* Get emails in sandbox by @narekhovhannisyan in https://github.com/mailtrap/mailtrap-mcp/pull/44
* chore(deps-dev): bump node-forge from 1.3.1 to 1.3.2 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/46
* chore(deps): bump express from 5.1.0 to 5.2.1 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/47
* chore(deps): bump @modelcontextprotocol/sdk from 1.18.2 to 1.24.0 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/48
* Update mailtrap version, refresh package-lock by @narekhovhannisyan in https://github.com/mailtrap/mailtrap-mcp/pull/49

## [0.0.5] - 2025-11-10

* Improve mcpb by @yanchuk in https://github.com/mailtrap/mailtrap-mcp/pull/39
* Add tool annotation by @yanchuk in https://github.com/mailtrap/mailtrap-mcp/pull/40

## [0.0.4] - 2025-24-10

* Bump axios from 1.8.4 to 1.12.1 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/35
* Bump @modelcontextprotocol/inspector from 0.14.1 to 0.16.6 by @dependabot[bot] in https://github.com/mailtrap/mailtrap-mcp/pull/33
* mcpb (former dxt) implementation by @narekhovhannisyan in https://github.com/mailtrap/mailtrap-mcp/pull/34
* Update references and manifest version by @narekhovhannisyan in https://github.com/mailtrap/mailtrap-mcp/pull/37

## [0.0.2] - 2025-04-04

- Bump version to update NPM page

## [0.0.1] - 2025-04-04

- Initial release of the official mailtrap.io MCP server
