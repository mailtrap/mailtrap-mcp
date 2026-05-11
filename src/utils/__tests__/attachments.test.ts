import { validateAndAdaptAttachments } from "../attachments";

/** "hello world" — well-formed base64. */
const TINY_B64 = "aGVsbG8gd29ybGQ=";

describe("validateAndAdaptAttachments", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    Object.keys(process.env).forEach((k) => {
      if (!(k in originalEnv)) delete process.env[k];
    });
    Object.assign(process.env, originalEnv);
  });

  it("returns undefined for empty / missing input", () => {
    expect(validateAndAdaptAttachments(undefined)).toBeUndefined();
    expect(validateAndAdaptAttachments(null as any)).toBeUndefined();
    expect(validateAndAdaptAttachments([])).toBeUndefined();
  });

  it("adapts a regular attachment to the Nodemailer shape", () => {
    const result = validateAndAdaptAttachments([
      {
        content: TINY_B64,
        filename: "report.pdf",
        type: "application/pdf",
      },
    ]);
    expect(result).toEqual([
      {
        content: TINY_B64,
        filename: "report.pdf",
        contentType: "application/pdf",
      },
    ]);
  });

  it("adapts an inline image with content_id", () => {
    const result = validateAndAdaptAttachments([
      {
        content: TINY_B64,
        filename: "logo.png",
        type: "image/png",
        disposition: "inline",
        content_id: "logo_image",
      },
    ]);
    expect(result).toEqual([
      {
        content: TINY_B64,
        filename: "logo.png",
        contentType: "image/png",
        contentDisposition: "inline",
        cid: "logo_image",
      },
    ]);
  });

  it("rejects inline disposition without content_id", () => {
    expect(() =>
      validateAndAdaptAttachments([
        {
          content: TINY_B64,
          filename: "logo.png",
          disposition: "inline",
        },
      ])
    ).toThrow(/content_id/);
  });

  it("rejects unknown disposition value", () => {
    expect(() =>
      validateAndAdaptAttachments([
        {
          content: TINY_B64,
          filename: "logo.png",
          disposition: "embedded" as any,
        },
      ])
    ).toThrow(/disposition/);
  });

  it("rejects content_id with invalid characters", () => {
    expect(() =>
      validateAndAdaptAttachments([
        {
          content: TINY_B64,
          filename: "logo.png",
          disposition: "inline",
          content_id: "bad cid",
        },
      ])
    ).toThrow(/content_id/);
  });

  it("rejects missing filename", () => {
    expect(() =>
      validateAndAdaptAttachments([{ content: TINY_B64 } as any])
    ).toThrow(/filename/);
  });

  it("rejects missing content", () => {
    expect(() =>
      validateAndAdaptAttachments([{ filename: "x.txt" } as any])
    ).toThrow(/content/);
  });

  it("rejects content that isn't valid base64", () => {
    expect(() =>
      validateAndAdaptAttachments([
        { content: "not!base64!", filename: "x.txt" },
      ])
    ).toThrow(/base64/);
  });

  it("rejects executable extensions by default", () => {
    expect(() =>
      validateAndAdaptAttachments([
        { content: TINY_B64, filename: "payload.exe" },
      ])
    ).toThrow(/blocked/);
  });

  it("rejects shell-script extensions and is case-insensitive", () => {
    expect(() =>
      validateAndAdaptAttachments([
        { content: TINY_B64, filename: "deploy.SH" },
      ])
    ).toThrow(/blocked/);
  });

  it("rejects blocked MIME types even if extension is benign", () => {
    expect(() =>
      validateAndAdaptAttachments([
        {
          content: TINY_B64,
          filename: "harmless.txt",
          type: "application/x-msdownload",
        },
      ])
    ).toThrow(/MIME/);
  });

  it("rejects an oversized single attachment using the env override", () => {
    // 1 KB cap, but content decodes to ~12 bytes — push it past with a long
    // base64 string that decodes to ~1.5 KB.
    process.env.MAILTRAP_MAX_ATTACHMENT_SIZE_BYTES = "1024";
    const oversized = "A".repeat(2400); // decodes to ~1800 bytes
    expect(() =>
      validateAndAdaptAttachments([
        { content: oversized, filename: "big.pdf" },
      ])
    ).toThrow(/per-attachment cap/);
  });

  it("rejects when the sum of attachments exceeds the total cap", () => {
    process.env.MAILTRAP_MAX_ATTACHMENT_SIZE_BYTES = "1000000";
    process.env.MAILTRAP_MAX_ATTACHMENTS_TOTAL_BYTES = "2000";
    const oneKb = "A".repeat(1400); // decodes to ~1050 bytes
    expect(() =>
      validateAndAdaptAttachments([
        { content: oneKb, filename: "a.pdf" },
        { content: oneKb, filename: "b.pdf" },
        { content: oneKb, filename: "c.pdf" },
      ])
    ).toThrow(/total cap/);
  });

  it("honours custom blocked-extensions list from env", () => {
    process.env.MAILTRAP_ATTACHMENT_BLOCKED_EXTENSIONS = ".secret";
    // .exe is no longer blocked when the env list is overridden
    expect(() =>
      validateAndAdaptAttachments([
        { content: TINY_B64, filename: "ok.exe" },
      ])
    ).not.toThrow();
    expect(() =>
      validateAndAdaptAttachments([
        { content: TINY_B64, filename: "leak.secret" },
      ])
    ).toThrow(/blocked/);
  });
});
