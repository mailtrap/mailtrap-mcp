function envSandboxId(): string | undefined {
  return process.env.MAILTRAP_SANDBOX_ID ?? process.env.MAILTRAP_TEST_INBOX_ID;
}

function parseResolvedId(
  raw: string | number | undefined | null,
  invalidMessage: string,
  missingMessage = "Provide sandbox_id or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
): number {
  if (raw === undefined || raw === null || raw === "") {
    throw new Error(missingMessage);
  }
  const resolved = Number(raw);
  if (!Number.isFinite(resolved)) {
    throw new Error(invalidMessage);
  }
  return resolved;
}

/**
 * Resolve sandbox ID from `sandbox_id`, then MAILTRAP_SANDBOX_ID / MAILTRAP_TEST_INBOX_ID.
 */
function resolveSandboxId(sandbox_id?: number): number {
  return parseResolvedId(
    sandbox_id ?? envSandboxId(),
    "sandbox_id (or MAILTRAP_SANDBOX_ID) must be a valid number"
  );
}

/**
 * For tools that historically used `test_inbox_id`: sandbox_id, then test_inbox_id, then env.
 */
/** Sandbox inbox admin tools: sandbox_id, then legacy inbox_id (no env fallback). */
export function resolveRequiredSandboxInboxId({
  sandbox_id,
  inbox_id,
}: {
  sandbox_id?: number;
  inbox_id?: number;
}): number {
  return parseResolvedId(
    sandbox_id ?? inbox_id,
    "sandbox_id (or inbox_id) must be a valid number",
    "Provide sandbox_id or inbox_id"
  );
}

export function resolveLegacySandboxInboxId({
  sandbox_id,
  test_inbox_id,
}: {
  sandbox_id?: number;
  test_inbox_id?: number;
} = {}): number {
  const raw = sandbox_id ?? test_inbox_id ?? envSandboxId();
  if (raw === undefined || raw === null || raw === "") {
    throw new Error(
      "Provide sandbox_id or test_inbox_id, or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
    );
  }
  const resolved = Number(raw);
  if (!Number.isFinite(resolved)) {
    throw new Error(
      "sandbox_id (or test_inbox_id / MAILTRAP_SANDBOX_ID) must be a valid number"
    );
  }
  return resolved;
}

export default resolveSandboxId;
