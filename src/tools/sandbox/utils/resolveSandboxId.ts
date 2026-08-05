/**
 * Resolve a sandbox ID from a tool argument, falling back to the
 * MAILTRAP_SANDBOX_ID environment variable (or the legacy MAILTRAP_TEST_INBOX_ID
 * env var, kept for backward compatibility). Throws if neither is set or if
 * the resolved value is not a finite number.
 *
 * `paramName`/`envName` only shape the error messages, so send-family tools
 * (which expose `test_inbox_id`) report the parameter the caller actually passes.
 */
function resolveSandboxId(
  sandboxId: number | undefined,
  paramName = "sandbox_id",
  envName = "MAILTRAP_SANDBOX_ID"
): number {
  const raw =
    sandboxId ??
    process.env.MAILTRAP_SANDBOX_ID ??
    process.env.MAILTRAP_TEST_INBOX_ID;
  if (raw === undefined || raw === null || raw === "") {
    throw new Error(
      `Provide ${paramName} or set ${envName} environment variable for sandbox mode`
    );
  }
  const resolved = Number(raw);
  if (!Number.isFinite(resolved)) {
    throw new Error(`${paramName} (or ${envName}) must be a valid number`);
  }
  return resolved;
}

export default resolveSandboxId;
