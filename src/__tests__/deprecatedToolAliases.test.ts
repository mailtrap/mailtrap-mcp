import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../server";
import { DEPRECATED_TOOL_ALIASES } from "../tools/deprecatedToolAliases";

const mockClient = {
  testing: {
    inboxes: {
      create: jest.fn(),
      getInboxAttributes: jest.fn(),
      updateInbox: jest.fn(),
      delete: jest.fn(),
      cleanInbox: jest.fn(),
    },
  },
  sendingDomains: {
    getList: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    sendSetupInstructions: jest.fn(),
  },
};

jest.mock("../client", () => ({
  ...jest.requireActual("../client"),
  requireClient: jest.fn(() => mockClient),
}));

const { inboxes } = mockClient.testing;
const { sendingDomains } = mockClient;

// Old tool names called with the params a hard-coded caller would still send.
const legacyCalls: [string, Record<string, unknown>, jest.Mock][] = [
  ["create-sandbox-inbox", { project_id: 1, name: "QA" }, inboxes.create],
  ["get-sandbox-inbox", { inbox_id: 10 }, inboxes.getInboxAttributes],
  ["update-sandbox-inbox", { inbox_id: 10, name: "QA" }, inboxes.updateInbox],
  ["delete-sandbox-inbox", { inbox_id: 10 }, inboxes.delete],
  ["clean-sandbox-inbox", { inbox_id: 10 }, inboxes.cleanInbox],
  ["list-sending-domains", {}, sendingDomains.getList],
  ["get-sending-domain", { sending_domain_id: 3938 }, sendingDomains.get],
  [
    "create-sending-domain",
    { domain_name: "example.com" },
    sendingDomains.create,
  ],
  [
    "update-sending-domain",
    { sending_domain_id: 3938, inbound_enabled: true },
    sendingDomains.update,
  ],
  ["delete-sending-domain", { sending_domain_id: 3938 }, sendingDomains.delete],
  [
    "send-sending-domain-setup-instructions",
    { sending_domain_id: 3938, email: "devops@example.com" },
    sendingDomains.sendSetupInstructions,
  ],
];

const apiResponse = {
  id: 10,
  name: "QA",
  domain_name: "example.com",
  dns_records: [],
  data: [],
};

describe("deprecated tool aliases", () => {
  let client: Client;
  let consoleError: jest.SpyInstance;

  beforeAll(async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    client = new Client({ name: "alias-test", version: "1.0.0" });
    await Promise.all([
      createServer().connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    legacyCalls.forEach(([, , apiCall]) =>
      apiCall.mockReset().mockResolvedValue(apiResponse)
    );
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("covers every alias", () => {
    expect(legacyCalls.map(([oldName]) => oldName).sort()).toEqual(
      [...DEPRECATED_TOOL_ALIASES.keys()].sort()
    );
  });

  it("lists the new tool names and hides the old ones", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((tool) => tool.name);

    DEPRECATED_TOOL_ALIASES.forEach((newName, oldName) => {
      expect(names).toContain(newName);
      expect(names).not.toContain(oldName);
    });
  });

  it.each(legacyCalls)(
    "%s runs its replacement and logs the deprecation once",
    async (oldName, args, apiCall) => {
      const result = await client.callTool({ name: oldName, arguments: args });
      await client.callTool({ name: oldName, arguments: args });

      expect(result.isError).toBeUndefined();
      expect(apiCall).toHaveBeenCalledTimes(2);
      expect(consoleError.mock.calls).toEqual([
        [
          `[mailtrap-mcp] Tool "${oldName}" is deprecated and will be removed in a future major release; use "${DEPRECATED_TOOL_ALIASES.get(
            oldName
          )}" instead.`,
        ],
      ]);
    }
  );

  it("runs a current tool name without a deprecation", async () => {
    const result = await client.callTool({
      name: "get-domain",
      arguments: { domain_id: 3938 },
    });

    expect(result.isError).toBeUndefined();
    expect(sendingDomains.get).toHaveBeenCalledWith(3938);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it.each([
    ["get-domain", "Failed to get domain: Provide domain_id"],
    [
      "delete-sandbox",
      "Failed to delete sandbox: Provide sandbox_id or inbox_id",
    ],
  ])(
    "reports a missing ID when %s is called without arguments",
    async (name, text) => {
      const result = await client.callTool({ name });

      expect(result.isError).toBe(true);
      expect(result.content).toEqual([{ type: "text", text }]);
    }
  );

  it("still rejects an unknown tool", async () => {
    await expect(
      client.callTool({ name: "no-such-tool", arguments: {} })
    ).rejects.toThrow("Unknown tool: no-such-tool");
  });
});
