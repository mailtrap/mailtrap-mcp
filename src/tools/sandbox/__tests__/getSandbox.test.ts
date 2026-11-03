import getSandbox from "../getSandbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    inboxes: {
      getInboxAttributes: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("getSandbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  const mockInbox = {
    id: 10,
    name: "Test Inbox",
    status: "active",
    emails_count: 5,
    emails_unread_count: 2,
    max_size: 50,
    username: "user123",
    password: "pass456",
    domain: "sandbox.mailtrap.io",
    smtp_ports: [25, 465, 587, 2525],
    pop3_domain: "pop3.mailtrap.io",
    pop3_ports: [1100, 9950],
    email_username: "inbox10",
    email_domain: "inbox.mailtrap.io",
    email_username_enabled: true,
    project_id: 1,
    last_message_sent_at: "2025-01-15T10:00:00Z",
  };

  it("should get sandbox details with explicit sandbox_id", async () => {
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue(mockInbox);

    const result = await getSandbox({ sandbox_id: 10 });

    expect(requireClient).toHaveBeenCalledWith("sandboxes");
    expect(mockClient.testing.inboxes.getInboxAttributes).toHaveBeenCalledWith(
      10
    );
    expect(result.content[0].text).toContain("Test Inbox");
    expect(result.content[0].text).toContain("ID: 10");
    expect(result.content[0].text).toContain("Emails: 5 (2 unread)");
    expect(result.content[0].text).toContain("SMTP Username: user123");
    expect(result.content[0].text).toContain("SMTP Password: pass456");
    expect(result.content[0].text).toContain("enabled");
    expect(result.isError).toBeUndefined();
  });

  it("should accept the legacy inbox_id", async () => {
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue(mockInbox);

    const result = await getSandbox({ inbox_id: 30 });

    expect(mockClient.testing.inboxes.getInboxAttributes).toHaveBeenCalledWith(
      30
    );
    expect(result.isError).toBeUndefined();
  });

  it("should fall back to MAILTRAP_SANDBOX_ID env var", async () => {
    Object.assign(process.env, { MAILTRAP_SANDBOX_ID: "20" });
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue(mockInbox);

    const result = await getSandbox({});

    expect(mockClient.testing.inboxes.getInboxAttributes).toHaveBeenCalledWith(
      20
    );
    expect(result.isError).toBeUndefined();
  });

  it("should error when no sandbox_id and no env var", async () => {
    delete process.env.MAILTRAP_SANDBOX_ID;
    delete process.env.MAILTRAP_TEST_INBOX_ID;

    const result = await getSandbox({});

    expect(
      mockClient.testing.inboxes.getInboxAttributes
    ).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain(
      "Provide sandbox_id or set MAILTRAP_SANDBOX_ID"
    );
    expect(result.isError).toBe(true);
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandboxes"
      );
    });

    const result = await getSandbox({ sandbox_id: 10 });

    expect(
      mockClient.testing.inboxes.getInboxAttributes
    ).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.inboxes.getInboxAttributes.mockRejectedValue(
      new Error("Not found")
    );

    const result = await getSandbox({ sandbox_id: 999 });

    expect(result.content[0].text).toContain("Failed to get sandbox");
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
