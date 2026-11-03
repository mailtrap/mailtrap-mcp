import warnDeprecated from "../utils/deprecation";

/**
 * Tool names from before Mailtrap called test inboxes "sandboxes" and sending
 * domains "domains", mapped to their replacements. tools/list advertises only
 * the new names; tools/call still accepts these, so hard-coded callers keep
 * working.
 */
export const DEPRECATED_TOOL_ALIASES: ReadonlyMap<string, string> = new Map([
  ["create-sandbox-inbox", "create-sandbox"],
  ["get-sandbox-inbox", "get-sandbox"],
  ["update-sandbox-inbox", "update-sandbox"],
  ["delete-sandbox-inbox", "delete-sandbox"],
  ["clean-sandbox-inbox", "clean-sandbox"],
  ["list-sending-domains", "list-domains"],
  ["get-sending-domain", "get-domain"],
  ["create-sending-domain", "create-domain"],
  ["update-sending-domain", "update-domain"],
  ["delete-sending-domain", "delete-domain"],
  ["send-sending-domain-setup-instructions", "send-domain-setup-instructions"],
]);

/** Returns the current name for a tool, logging once when `name` is deprecated. */
export function resolveToolName(name: string): string {
  const replacement = DEPRECATED_TOOL_ALIASES.get(name);
  if (!replacement) {
    return name;
  }
  warnDeprecated(`Tool "${name}"`, `"${replacement}"`);
  return replacement;
}
