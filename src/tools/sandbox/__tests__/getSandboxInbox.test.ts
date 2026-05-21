import getSandboxInbox from "../getSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { inboxes: { getInboxAttributes: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("getSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("returns the inbox as JSON when inbox_id provided", async () => {
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue({
      id: 42,
      name: "Welcome",
      status: "active",
      emails_count: 5,
    });

    const result = await getSandboxInbox({ inbox_id: 42 });

    expect(mockClient.testing.inboxes.getInboxAttributes).toHaveBeenCalledWith(
      42
    );
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"name": "Welcome"');
    expect(result.isError).toBeUndefined();
  });

  it("falls back to MAILTRAP_TEST_INBOX_ID env var", async () => {
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "20" });
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue({
      id: 20,
    });

    await getSandboxInbox({});

    expect(mockClient.testing.inboxes.getInboxAttributes).toHaveBeenCalledWith(
      20
    );
  });

  it("errors when no inbox_id available", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;
    const result = await getSandboxInbox({});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_TEST_INBOX_ID");
  });

  it("surfaces API errors", async () => {
    mockClient.testing.inboxes.getInboxAttributes.mockRejectedValue(
      new Error("not found")
    );
    const result = await getSandboxInbox({ inbox_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get sandbox inbox: not found"
    );
  });
});
