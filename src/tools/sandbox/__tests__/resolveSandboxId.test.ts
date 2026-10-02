import resolveSandboxId, {
  resolveLegacySandboxInboxId,
  resolveRequiredSandboxInboxId,
} from "../utils/resolveSandboxId";

describe("resolveSandboxId", () => {
  beforeEach(() => {
    delete process.env.MAILTRAP_SANDBOX_ID;
    delete process.env.MAILTRAP_TEST_INBOX_ID;
  });

  it("uses sandbox_id when provided", () => {
    process.env.MAILTRAP_SANDBOX_ID = "20";

    expect(resolveSandboxId(10)).toBe(10);
  });

  it("falls back to MAILTRAP_SANDBOX_ID when sandbox_id is omitted", () => {
    process.env.MAILTRAP_SANDBOX_ID = "20";
    process.env.MAILTRAP_TEST_INBOX_ID = "30";

    expect(resolveSandboxId()).toBe(20);
  });

  it("falls back to MAILTRAP_TEST_INBOX_ID when no sandbox_id param", () => {
    delete process.env.MAILTRAP_SANDBOX_ID;
    process.env.MAILTRAP_TEST_INBOX_ID = "30";

    expect(resolveSandboxId()).toBe(30);
  });

  it("throws when no param or env is set", () => {
    expect(() => resolveSandboxId()).toThrow(
      "Provide sandbox_id or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
    );
  });

  it("rejects a blank MAILTRAP_SANDBOX_ID instead of resolving to 0", () => {
    process.env.MAILTRAP_SANDBOX_ID = " ";

    expect(() => resolveSandboxId()).toThrow(
      "Provide sandbox_id or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
    );
  });

  it("skips a blank MAILTRAP_SANDBOX_ID and uses MAILTRAP_TEST_INBOX_ID", () => {
    process.env.MAILTRAP_SANDBOX_ID = "";
    process.env.MAILTRAP_TEST_INBOX_ID = "20";

    expect(resolveSandboxId()).toBe(20);
  });
});

describe("resolveRequiredSandboxInboxId", () => {
  it("prefers sandbox_id over inbox_id", () => {
    expect(resolveRequiredSandboxInboxId({ sandbox_id: 1, inbox_id: 2 })).toBe(
      1
    );
  });

  it("throws when neither param is set", () => {
    expect(() => resolveRequiredSandboxInboxId({})).toThrow(
      "Provide sandbox_id or inbox_id"
    );
  });
});

describe("resolveLegacySandboxInboxId", () => {
  beforeEach(() => {
    delete process.env.MAILTRAP_SANDBOX_ID;
    delete process.env.MAILTRAP_TEST_INBOX_ID;
  });

  it("prefers sandbox_id over test_inbox_id and env", () => {
    process.env.MAILTRAP_SANDBOX_ID = "20";

    expect(
      resolveLegacySandboxInboxId({ sandbox_id: 10, test_inbox_id: 11 })
    ).toBe(10);
  });

  it("falls back to test_inbox_id when sandbox_id is omitted", () => {
    process.env.MAILTRAP_SANDBOX_ID = "20";

    expect(resolveLegacySandboxInboxId({ test_inbox_id: 11 })).toBe(11);
  });

  it("throws when no param or env is set", () => {
    expect(() => resolveLegacySandboxInboxId()).toThrow(
      "Provide sandbox_id or test_inbox_id, or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
    );
  });
});
