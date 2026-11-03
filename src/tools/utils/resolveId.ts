export function isBlank(value: string | number | undefined | null): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

/** Parses an ID taken from a tool param or env var, rejecting blank and non-numeric values. */
export function parseResolvedId(
  raw: string | number | undefined | null,
  invalidMessage: string,
  missingMessage: string
): number {
  if (isBlank(raw)) {
    throw new Error(missingMessage);
  }
  const resolved = Number(raw);
  if (!Number.isFinite(resolved)) {
    throw new Error(invalidMessage);
  }
  return resolved;
}
