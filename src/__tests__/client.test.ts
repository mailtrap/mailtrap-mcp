import { getOrganizationClient } from "../client";

describe("MCP client info forwarding", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  // The default client reads MAILTRAP_API_TOKEN at import time, so load a fresh
  // module instance per test with the token in place.
  function loadClientModule(): typeof import("../client") {
    let mod: typeof import("../client") | undefined;
    process.env.MAILTRAP_API_TOKEN = "test-token";
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
      mod = require("../client");
    });
    return mod as typeof import("../client");
  }

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
