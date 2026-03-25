import getSandboxInbox from "../getSandboxInbox";
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

describe("getSandboxInbox", () => {
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

  it("should get inbox details with explicit inbox_id", async () => {
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue(mockInbox);

    const result = await getSandboxInbox({ inbox_id: 10 });

    expect(requireClient).toHaveBeenCalledWith("sandbox inboxes");
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

  it("should fall back to MAILTRAP_TEST_INBOX_ID env var", async () => {
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "20" });
    mockClient.testing.inboxes.getInboxAttributes.mockResolvedValue(mockInbox);

    const result = await getSandboxInbox({});

    expect(mockClient.testing.inboxes.getInboxAttributes).toHaveBeenCalledWith(
      20
    );
    expect(result.isError).toBeUndefined();
  });

  it("should error when no inbox_id and no env var", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;

    const result = await getSandboxInbox({});

    expect(
      mockClient.testing.inboxes.getInboxAttributes
    ).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("Provide inbox_id");
    expect(result.isError).toBe(true);
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox inboxes"
      );
    });

    const result = await getSandboxInbox({ inbox_id: 10 });

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

    const result = await getSandboxInbox({ inbox_id: 999 });

    expect(result.content[0].text).toContain("Failed to get sandbox inbox");
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
