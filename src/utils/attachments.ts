/**
 * Attachment validation and adaptation for Mailtrap send-email tools.
 *
 * The MCP exposes Mailtrap's wire-format field names (`content`, `filename`,
 * `type`, `disposition`, `content_id`) at the tool boundary because those
 * match the public Mailtrap API docs the LLM will reference. This module:
 *
 *   1. Validates each attachment (size, MIME / extension denylist, inline
 *      disposition shape, base64 well-formedness).
 *   2. Enforces a per-attachment cap and a sum cap across all attachments,
 *      both overridable via env vars.
 *   3. Adapts the validated attachments to the Nodemailer-shaped objects the
 *      `mailtrap` SDK's `Mail.attachments` field expects.
 *
 * Files are never read from disk here — callers must supply already-encoded
 * base64 content. This keeps the MCP a passive transport and forces any
 * filesystem read to flow through a separate MCP whose permissions the user
 * can audit independently.
 */
import { AttachmentParam } from "../types/mailtrap";

/** Default per-attachment size cap (10 MB raw / decoded). */
const DEFAULT_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
/** Default sum-of-all-attachments cap (15 MB raw). Mailtrap's hard ceiling is
 *  ~20 MB per message after base64; this leaves room for body and headers. */
const DEFAULT_MAX_ATTACHMENTS_TOTAL_BYTES = 15 * 1024 * 1024;

/**
 * Filename extensions blocked by default. MIME types can be spoofed, so we
 * also reject by extension. Override (for testing) via
 * `MAILTRAP_ATTACHMENT_BLOCKED_EXTENSIONS` as a comma-separated list (lowercase,
 * leading dot or not).
 */
const DEFAULT_BLOCKED_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".scr",
  ".pif",
  ".lnk",
  ".vbs",
  ".vbe",
  ".js",
  ".jse",
  ".wsf",
  ".wsh",
  ".ps1",
  ".msi",
  ".reg",
  ".hta",
  ".scf",
  ".jar",
  ".dll",
  ".sh",
];

/** MIME types blocked by default. */
const DEFAULT_BLOCKED_MIME_TYPES = [
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-exe",
  "application/x-executable",
  "application/x-shellscript",
  "application/x-sh",
  "text/x-shellscript",
];

/** Adapted attachment in the shape the `mailtrap` SDK expects (Nodemailer-style). */
export interface AdaptedAttachment {
  filename: string;
  content: string;
  contentType?: string;
  contentDisposition?: "attachment" | "inline";
  cid?: string;
}

function parsePositiveIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function parseListEnv(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

/** Approximate decoded byte length of a base64 string without actually decoding. */
function approxDecodedSize(b64: string): number {
  const padding = (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
  return Math.floor((b64.length * 3) / 4) - padding;
}

/** True if `s` looks like a well-formed standard base64 string. */
function isBase64(s: string): boolean {
  if (s.length === 0) return false;
  // Allow padding only at the end. No whitespace tolerated — callers should
  // strip any line-wrapping before sending.
  return /^[A-Za-z0-9+/]+={0,2}$/.test(s);
}

/** True if the filename ends in any of the blocked extensions (case-insensitive). */
function hasBlockedExtension(filename: string, blocked: string[]): boolean {
  const lower = filename.toLowerCase();
  return blocked.some((ext) => {
    const dotted = ext.startsWith(".") ? ext : `.${ext}`;
    return lower.endsWith(dotted);
  });
}

/**
 * Validate one attachment and convert to the Nodemailer-style shape the
 * Mailtrap SDK expects. Throws with a clear error message on any failure.
 */
function validateAndAdaptOne(
  att: AttachmentParam,
  index: number,
  perAttachmentMax: number,
  blockedExtensions: string[],
  blockedMimeTypes: string[]
): { adapted: AdaptedAttachment; decodedSize: number } {
  const label = `attachments[${index}]`;

  if (!att || typeof att !== "object") {
    throw new Error(`${label}: must be an object`);
  }
  if (!att.filename || typeof att.filename !== "string") {
    throw new Error(`${label}: 'filename' is required and must be a string`);
  }
  if (!att.content || typeof att.content !== "string") {
    throw new Error(
      `${label}: 'content' is required and must be a base64-encoded string`
    );
  }
  if (!isBase64(att.content)) {
    throw new Error(
      `${label}: 'content' must be a base64-encoded string (no whitespace, padded with '=')`
    );
  }

  const decodedSize = approxDecodedSize(att.content);
  if (decodedSize > perAttachmentMax) {
    throw new Error(
      `${label}: decoded size ${decodedSize} bytes exceeds per-attachment cap ${perAttachmentMax} bytes ` +
        `(override with MAILTRAP_MAX_ATTACHMENT_SIZE_BYTES)`
    );
  }

  if (hasBlockedExtension(att.filename, blockedExtensions)) {
    throw new Error(
      `${label}: filename extension is blocked for safety. ` +
        `Filename: ${att.filename}. To override, set MAILTRAP_ATTACHMENT_BLOCKED_EXTENSIONS.`
    );
  }

  if (
    att.type &&
    blockedMimeTypes.includes(att.type.toLowerCase().trim())
  ) {
    throw new Error(
      `${label}: MIME type '${att.type}' is blocked for safety. ` +
        `To override, set MAILTRAP_ATTACHMENT_BLOCKED_MIME_TYPES.`
    );
  }

  const disposition = att.disposition;
  if (
    disposition !== undefined &&
    disposition !== "attachment" &&
    disposition !== "inline"
  ) {
    throw new Error(
      `${label}: 'disposition' must be 'attachment' or 'inline' if provided`
    );
  }
  if (disposition === "inline") {
    if (!att.content_id || typeof att.content_id !== "string") {
      throw new Error(
        `${label}: inline attachments require 'content_id' (referenced as <img src="cid:...">)`
      );
    }
    if (!/^[A-Za-z0-9._-]+$/.test(att.content_id)) {
      throw new Error(
        `${label}: 'content_id' must contain only letters, digits, '.', '_' or '-'`
      );
    }
  }

  const adapted: AdaptedAttachment = {
    filename: att.filename,
    content: att.content,
  };
  if (att.type) adapted.contentType = att.type;
  if (disposition) adapted.contentDisposition = disposition;
  if (att.content_id) adapted.cid = att.content_id;

  return { adapted, decodedSize };
}

/**
 * Validate the full attachments array (if present) and return the
 * Nodemailer-shaped list ready to assign to `Mail.attachments`. Returns
 * `undefined` when the input is null/undefined/empty so callers can simply
 * spread the result into the SDK payload.
 */
export function validateAndAdaptAttachments(
  attachments: AttachmentParam[] | undefined | null
): AdaptedAttachment[] | undefined {
  if (!attachments || attachments.length === 0) return undefined;
  if (!Array.isArray(attachments)) {
    throw new Error("attachments: must be an array");
  }

  const perAttachmentMax = parsePositiveIntEnv(
    "MAILTRAP_MAX_ATTACHMENT_SIZE_BYTES",
    DEFAULT_MAX_ATTACHMENT_BYTES
  );
  const totalMax = parsePositiveIntEnv(
    "MAILTRAP_MAX_ATTACHMENTS_TOTAL_BYTES",
    DEFAULT_MAX_ATTACHMENTS_TOTAL_BYTES
  );
  const blockedExtensions = parseListEnv(
    "MAILTRAP_ATTACHMENT_BLOCKED_EXTENSIONS",
    DEFAULT_BLOCKED_EXTENSIONS
  );
  const blockedMimeTypes = parseListEnv(
    "MAILTRAP_ATTACHMENT_BLOCKED_MIME_TYPES",
    DEFAULT_BLOCKED_MIME_TYPES
  );

  const adapted: AdaptedAttachment[] = [];
  let totalBytes = 0;
  for (let i = 0; i < attachments.length; i += 1) {
    const { adapted: one, decodedSize } = validateAndAdaptOne(
      attachments[i],
      i,
      perAttachmentMax,
      blockedExtensions,
      blockedMimeTypes
    );
    totalBytes += decodedSize;
    if (totalBytes > totalMax) {
      throw new Error(
        `attachments: combined decoded size exceeds total cap ${totalMax} bytes ` +
          `(override with MAILTRAP_MAX_ATTACHMENTS_TOTAL_BYTES)`
      );
    }
    adapted.push(one);
  }
  return adapted;
}
