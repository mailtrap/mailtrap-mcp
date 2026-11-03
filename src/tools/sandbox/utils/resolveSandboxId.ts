import warnDeprecated from "../../../utils/deprecation";
import { isBlank, parseResolvedId } from "../../utils/resolveId";

/** MAILTRAP_SANDBOX_ID, then the legacy MAILTRAP_TEST_INBOX_ID (logged as deprecated). */
function envSandboxId(): string | undefined {
  const { MAILTRAP_SANDBOX_ID, MAILTRAP_TEST_INBOX_ID } = process.env;
  if (!isBlank(MAILTRAP_SANDBOX_ID)) {
    return MAILTRAP_SANDBOX_ID;
  }
  if (isBlank(MAILTRAP_TEST_INBOX_ID)) {
    return undefined;
  }
  warnDeprecated("MAILTRAP_TEST_INBOX_ID", "MAILTRAP_SANDBOX_ID");
  return MAILTRAP_TEST_INBOX_ID;
}

/**
 * Resolve sandbox ID from `sandbox_id`, then MAILTRAP_SANDBOX_ID / MAILTRAP_TEST_INBOX_ID.
 */
function resolveSandboxId(sandbox_id?: number): number {
  return parseResolvedId(
    sandbox_id ?? envSandboxId(),
    "sandbox_id (or MAILTRAP_SANDBOX_ID) must be a positive integer",
    "Provide sandbox_id or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
  );
}

/** update/delete/clean-sandbox: sandbox_id, then legacy inbox_id (no env fallback). */
export function resolveRequiredSandboxInboxId({
  sandbox_id,
  inbox_id,
}: {
  sandbox_id?: number;
  inbox_id?: number;
}): number {
  return parseResolvedId(
    sandbox_id ?? inbox_id,
    "sandbox_id (or inbox_id) must be a positive integer",
    "Provide sandbox_id or inbox_id"
  );
}

/**
 * For tools that historically used `test_inbox_id`: sandbox_id, then test_inbox_id, then env.
 */
export function resolveLegacySandboxInboxId({
  sandbox_id,
  test_inbox_id,
}: {
  sandbox_id?: number;
  test_inbox_id?: number;
} = {}): number {
  return parseResolvedId(
    sandbox_id ?? test_inbox_id ?? envSandboxId(),
    "sandbox_id (or test_inbox_id / MAILTRAP_SANDBOX_ID) must be a positive integer",
    "Provide sandbox_id or test_inbox_id, or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
  );
}

export default resolveSandboxId;
