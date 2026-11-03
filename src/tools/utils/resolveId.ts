export function isBlank(value: string | number | undefined | null): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

/** Parses an ID taken from a tool param or env var, rejecting blank values and anything but a positive integer. */
export function parseResolvedId(
  raw: string | number | undefined | null,
  invalidMessage: string,
  missingMessage: string
): number {
  if (isBlank(raw)) {
    throw new Error(missingMessage);
  }
  // Number() alone would also take "0x10" and "1e3", so string IDs must be plain digits.
  const resolved = Number(raw);
  const isPlainDecimal = typeof raw !== "string" || /^\d+$/.test(raw.trim());
  if (!isPlainDecimal || !Number.isInteger(resolved) || resolved < 1) {
    throw new Error(invalidMessage);
  }
  return resolved;
}
