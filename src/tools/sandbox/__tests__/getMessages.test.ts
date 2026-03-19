import getMessages from "../getSandboxMessages";
import { getSandboxClient } from "../../../client";

const mockGet = jest.fn();
jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => ({
    testing: { messages: { get: mockGet } },
  })),
}));

describe("getMessages", () => {
  const inboxId = 123;
  const mockMessages = [
    {
      id: 1,
      from_email: "sender@example.com",
      to_email: "recipient@example.com",
      subject: "Test Subject 1",
      sent_at: "2024-01-01T00:00:00Z",
      is_read: false,
    },
    {
      id: 2,
      from_email: "sender2@example.com",
      to_email: "recipient@example.com",
      subject: "Test Subject 2",
      sent_at: "2024-01-02T00:00:00Z",
      is_read: true,
    },
  ];

  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockGet.mockResolvedValue(mockMessages);
    (getSandboxClient as jest.Mock).mockReturnValue({
      testing: { messages: { get: mockGet } },
    });
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: String(inboxId) });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should get messages successfully", async () => {
    const result = await getMessages({});

    expect(mockGet).toHaveBeenCalledWith(inboxId, undefined);

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Found 2 message(s) in sandbox inbox:\n\n• Message ID: 1\n  From: sender@example.com\n  To: recipient@example.com\n  Subject: Test Subject 1\n  Sent: 2024-01-01T00:00:00Z\n  Read: No\n\n• Message ID: 2\n  From: sender2@example.com\n  To: recipient@example.com\n  Subject: Test Subject 2\n  Sent: 2024-01-02T00:00:00Z\n  Read: Yes\n`,
        },
      ],
    });
  });

  it("should handle empty messages list", async () => {
    mockGet.mockResolvedValue([]);

    const result = await getMessages({});

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "No messages found in the sandbox inbox.",
        },
      ],
    });
  });

  it("should handle null messages response", async () => {
    mockGet.mockResolvedValue(null);

    const result = await getMessages({});

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "No messages found in the sandbox inbox.",
        },
      ],
    });
  });

  it("should handle missing test_inbox_id and MAILTRAP_TEST_INBOX_ID", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    delete process.env.MAILTRAP_TEST_INBOX_ID;

    const result = await getMessages({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting messages:",
      expect.anything()
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Provide test_inbox_id or set MAILTRAP_TEST_INBOX_ID"
    );
    consoleErrorSpy.mockRestore();
  });

  it("should use test_inbox_id parameter when provided", async () => {
    const result = await getMessages({ test_inbox_id: 456 });

    expect(getSandboxClient).toHaveBeenCalledWith(456);
    expect(mockGet).toHaveBeenCalledWith(456, undefined);
    expect(result.content[0].text).toContain("Found 2 message(s)");
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    mockGet.mockRejectedValue(mockError);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await getMessages({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting messages:",
      mockError
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to get messages");
    expect(result.content[0].text).toContain("API Error");
    consoleErrorSpy.mockRestore();
  });

  it("should pass page parameter to SDK", async () => {
    await getMessages({ page: 2 });

    expect(mockGet).toHaveBeenCalledWith(inboxId, { page: 2 });
  });

  it("should pass last_id parameter to SDK", async () => {
    await getMessages({ last_id: 100 });

    expect(mockGet).toHaveBeenCalledWith(inboxId, { last_id: 100 });
  });

  it("should pass search parameter to SDK", async () => {
    await getMessages({ search: "test query" });

    expect(mockGet).toHaveBeenCalledWith(inboxId, { search: "test query" });
  });

  it("should pass multiple parameters to SDK", async () => {
    await getMessages({ page: 1, search: "test" });

    expect(mockGet).toHaveBeenCalledWith(inboxId, { page: 1, search: "test" });
  });

  it("should pass all parameters to SDK", async () => {
    await getMessages({ page: 2, last_id: 100, search: "test query" });

    expect(mockGet).toHaveBeenCalledWith(inboxId, {
      page: 2,
      last_id: 100,
      search: "test query",
    });
  });
});
