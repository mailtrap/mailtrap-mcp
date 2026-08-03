import config from "../config";

/**
 * MCP client identity reported during the `initialize` handshake. Structurally
 * a subset of the MCP SDK's `Implementation` (name + version).
 */
export interface McpClientInfo {
  name?: string;
  version?: string;
}

/**
 * The client name/version come from an external MCP client, so strip anything
 * that could break the outgoing HTTP header or the User-Agent comment grammar:
 * non-printable ASCII, parentheses (comment delimiters), and runaway length.
 */
function sanitizeToken(value: string, maxLength = 64): string {
  return value
    .replace(/[^\x20-\x7e]/g, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Render an MCP client identity as `name/version` (or just `name` when no
 * version is reported). Returns null when there is no usable name.
 */
export function formatClientInfo(
  info: McpClientInfo | undefined
): string | null {
  if (!info) {
    return null;
  }
  const name = sanitizeToken(info.name ?? "");
  if (!name) {
    return null;
  }
  const version = sanitizeToken(info.version ?? "");
  return version ? `${name}/${version}` : name;
}

/**
 * Build the User-Agent for outgoing Mailtrap API calls, appending the MCP
 * client identity when one was captured during the handshake, e.g.
 * `mailtrap-mcp/0.6.0 (+https://github.com/mailtrap/mailtrap-mcp) (client: Claude Desktop/1.5.3)`.
 */
export function buildUserAgent(info: McpClientInfo | undefined): string {
  const client = formatClientInfo(info);
  return client
    ? `${config.USER_AGENT} (client: ${client})`
    : config.USER_AGENT;
}
