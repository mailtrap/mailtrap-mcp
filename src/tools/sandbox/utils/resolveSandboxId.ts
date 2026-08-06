/**
 * Resolve a sandbox ID from a tool argument, falling back to the
 * MAILTRAP_SANDBOX_ID environment variable (or the legacy MAILTRAP_TEST_INBOX_ID
 * env var, kept for backward compatibility). Throws if neither is set or if
 * the resolved value is not a finite number.
 */
function resolveSandboxId(sandboxId: number | undefined): number {
  const raw =
    sandboxId ??
    process.env.MAILTRAP_SANDBOX_ID ??
    process.env.MAILTRAP_TEST_INBOX_ID;
  if (raw === undefined || raw === null || raw === "") {
    throw new Error(
      "Provide sandbox_id or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
    );
  }
  const resolved = Number(raw);
  if (!Number.isFinite(resolved)) {
    throw new Error(
      "sandbox_id (or MAILTRAP_SANDBOX_ID) must be a valid number"
    );
  }
  return resolved;
}

export default resolveSandboxId;
