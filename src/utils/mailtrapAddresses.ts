import { Address } from "mailtrap";

import type { MailtrapAddressParam } from "../types/mailtrap";

/**
 * Some MCP clients (e.g. Claude Desktop) strip `oneOf` unions from property
 * schemas, after which array/object arguments can arrive as JSON-encoded
 * strings. If a string value looks like a JSON array/object, parse it back;
 * otherwise return the value unchanged.
 */
function reviveJsonString(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) {
    return value;
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

/**
 * Normalizes a single address entry — an email string, `{ email, name? }`,
 * or a JSON-stringified form of either. Entries without a usable email are
 * dropped, as are nested arrays (only one list level is semantically valid).
 */
function normalizeAddressItem(item: unknown): Address[] {
  const revived = reviveJsonString(item);
  if (typeof revived === "string") {
    const e = revived.trim();
    return e.length > 0 ? [{ email: e }] : [];
  }
  if (
    revived !== null &&
    typeof revived === "object" &&
    !Array.isArray(revived)
  ) {
    const { email, name } = revived as { email?: unknown; name?: unknown };
    const e = typeof email === "string" ? email.trim() : "";
    if (e.length === 0) {
      return [];
    }
    const addr: Address = { email: e };
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (trimmedName) {
      addr.name = trimmedName;
    }
    return [addr];
  }
  return [];
}

/**
 * Normalizes any accepted address input — a single entry, an array of
 * entries, or a JSON-stringified form of those — into a list of Mailtrap
 * addresses.
 */
function normalizeAddressValue(value: unknown): Address[] {
  const revived = reviveJsonString(value);
  const list = Array.isArray(revived) ? revived : [revived];
  return list.flatMap(normalizeAddressItem);
}

/**
 * `context` names the field (and, for batch sends, the request) in the error
 * message, e.g. `"'from'"` or `"requests[2] 'reply_to'"`.
 */
export function toMailtrapAddress(
  input: MailtrapAddressParam,
  context?: string
): Address {
  const [first] = normalizeAddressValue(input);
  if (!first) {
    throw new Error(
      `Invalid address${
        context ? ` in ${context}` : ""
      }: provide an email string or \`{ email, name? }\``
    );
  }
  return first;
}

export function buildFromAddress(
  from: MailtrapAddressParam | undefined,
  defaultEmail: string | undefined
): Address {
  if (from === undefined) {
    if (!defaultEmail) {
      throw new Error(
        "Provide 'from' or set DEFAULT_FROM_EMAIL environment variable"
      );
    }
    return { email: defaultEmail };
  }
  return toMailtrapAddress(from, "'from'");
}

export function normalizeAddressList(
  inputs: MailtrapAddressParam[] | string
): Address[] {
  return normalizeAddressValue(inputs);
}

export function normalizeToRecipients(
  to: MailtrapAddressParam | MailtrapAddressParam[]
): Address[] {
  return normalizeAddressValue(to);
}

/**
 * Sandbox `to` as comma-separated string (plain emails) or an array of address
 * params (or a JSON-stringified form of the latter).
 * Returns an empty array if no valid recipients are present; callers are responsible
 * for validating that the combined to/cc/bcc has at least one recipient.
 */
export function parseSandboxTo(to: string | MailtrapAddressParam[]): Address[] {
  const revived = reviveJsonString(to);
  if (typeof revived === "string") {
    const toEmails = revived
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    return toEmails.map((email) => ({ email }));
  }
  return normalizeAddressValue(revived);
}
