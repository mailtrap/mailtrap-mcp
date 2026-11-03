const warned = new Set<string>();

/**
 * Logs a deprecation once per process for each old name, so a loop of calls
 * doesn't flood the log. Writes to stderr: stdout carries the MCP protocol.
 */
function warnDeprecated(oldName: string, newName: string): void {
  if (warned.has(oldName)) {
    return;
  }
  warned.add(oldName);
  console.error(
    `[mailtrap-mcp] ${oldName} is deprecated and will be removed in a future major release; use ${newName} instead.`
  );
}

export default warnDeprecated;
