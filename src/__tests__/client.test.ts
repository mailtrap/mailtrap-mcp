import { getOrganizationClient } from "../client";

// The client module reads MAILTRAP_API_TOKEN at import time, so load a fresh
// module instance per test with the token in place.
function loadClientModule(
  token: string | null = "test-token"
): typeof import("../client") {
  let mod: typeof import("../client") | undefined;
  if (token === null) {
    delete process.env.MAILTRAP_API_TOKEN;
  } else {
    process.env.MAILTRAP_API_TOKEN = token;
  }
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    mod = require("../client");
  });
  return mod as typeof import("../client");
}

describe("MCP client info forwarding", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  function headerString(client: unknown): string {
    return JSON.stringify(
      (client as { axios: { defaults: { headers: unknown } } }).axios.defaults
        .headers
    );
  }

  it("forwards the MCP client identity in the default client's User-Agent", () => {
    const client = loadClientModule();
    client.setMcpClientInfoProvider(() => ({
      name: "Claude Desktop",
      version: "1.5.3",
    }));

    const mailtrap = client.requireClient("test", { requireAccountId: false });
    expect(headerString(mailtrap)).toContain("(client: Claude Desktop/1.5.3)");
  });

  it("reflects an identity that becomes available after an earlier call", () => {
    const client = loadClientModule();
    let info: { name: string; version: string } | undefined;
    client.setMcpClientInfoProvider(() => info);

    // Before the handshake identity is known: base User-Agent.
    const before = client.requireClient("test", { requireAccountId: false });
    expect(headerString(before)).not.toContain("(client:");

    // Once known, later clients forward it — nothing stale is cached.
    info = { name: "Cursor", version: "2.0.0" };
    const after = client.requireClient("test", { requireAccountId: false });
    expect(headerString(after)).toContain("(client: Cursor/2.0.0)");
  });

  it("forwards the identity via the sandbox client too", () => {
    const client = loadClientModule();
    client.setMcpClientInfoProvider(() => ({ name: "Windsurf", version: "3" }));

    expect(headerString(client.getSandboxClient(123))).toContain(
      "(client: Windsurf/3)"
    );
  });

  it("uses the base User-Agent when no MCP client identity is available", () => {
    const client = loadClientModule();

    expect(headerString(client.getSandboxClient(123))).not.toContain(
      "(client:"
    );
  });
});

describe("getAccountsClient", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  it("reaches general.accounts without MAILTRAP_ACCOUNT_ID", () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    const client = loadClientModule();

    expect(() => client.getAccountsClient().general.accounts).not.toThrow();
  });

  it("uses MAILTRAP_ACCOUNT_ID when it is set", () => {
    process.env.MAILTRAP_ACCOUNT_ID = "4242";
    const client = loadClientModule();

    expect(
      (client.getAccountsClient() as unknown as { accountId: number }).accountId
    ).toBe(4242);
  });

  it("requires MAILTRAP_API_TOKEN", () => {
    const client = loadClientModule(null);

    expect(() => client.getAccountsClient()).toThrow(
      "MAILTRAP_API_TOKEN environment variable is required"
    );
  });

  // Fails once the SDK stops requiring an account ID for `general`; then drop the placeholder.
  it("works around the SDK rejecting general without an account ID", () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    const client = loadClientModule();

    expect(
      () =>
        client.requireClient("accounts", { requireAccountId: false }).general
    ).toThrow("accountId is missing");
  });
});

describe("getOrganizationClient", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.MAILTRAP_ORGANIZATION_API_TOKEN = "test-token";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns a client when organization ID is a positive integer", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "42";

    expect(() => getOrganizationClient()).not.toThrow();
  });

  it("rejects a missing organization ID", () => {
    delete process.env.MAILTRAP_ORGANIZATION_ID;

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a non-numeric organization ID", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "not-a-number";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects zero", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "0";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a decimal organization ID", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "1.5";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a negative organization ID", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "-1";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a missing organization API token", () => {
    delete process.env.MAILTRAP_ORGANIZATION_API_TOKEN;
    process.env.MAILTRAP_ORGANIZATION_ID = "42";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_API_TOKEN environment variable is required/
    );
  });
});
