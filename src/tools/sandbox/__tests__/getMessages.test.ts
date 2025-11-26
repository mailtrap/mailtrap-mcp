import getMessages from "../getSandboxMessages";
import { sandboxClient } from "../../../client";

jest.mock("../../../client", () => ({
  sandboxClient: {
    testing: {
      messages: {
        get: jest.fn(),
      },
    },
  },
}));

describe("getMessages", () => {
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
    (sandboxClient as any).testing.messages.get.mockResolvedValue(mockMessages);
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "123" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should get messages successfully", async () => {
    const result = await getMessages({});

    expect((sandboxClient as any).testing.messages.get).toHaveBeenCalledWith(
      123,
      undefined
    );

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
    (sandboxClient as any).testing.messages.get.mockResolvedValue([]);

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
    (sandboxClient as any).testing.messages.get.mockResolvedValue(null);

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

  it("should handle missing MAILTRAP_TEST_INBOX_ID", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;

    const result = await getMessages({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "MAILTRAP_TEST_INBOX_ID environment variable is required"
    );
  });

  it("should handle missing sandbox client", async () => {
    // Mock sandboxClient as null for this test
    jest.doMock("../../../client", () => ({
      sandboxClient: null,
    }));

    // Re-import the module to get the mocked version
    jest.resetModules();
    const getMessagesModule = (await import("../getSandboxMessages")).default;
    const result = await getMessagesModule({});

    // Restore the original mock
    jest.dontMock("../../../client");
    jest.resetModules();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Sandbox client is not available");
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    (sandboxClient as any).testing.messages.get.mockRejectedValue(mockError);

    const result = await getMessages({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to get messages");
    expect(result.content[0].text).toContain("API Error");
  });

  it("should pass page parameter to SDK", async () => {
    await getMessages({ page: 2 });

    expect((sandboxClient as any).testing.messages.get).toHaveBeenCalledWith(
      123,
      { page: 2 }
    );
  });

  it("should pass last_id parameter to SDK", async () => {
    await getMessages({ last_id: 100 });

    expect((sandboxClient as any).testing.messages.get).toHaveBeenCalledWith(
      123,
      { last_id: 100 }
    );
  });

  it("should pass search parameter to SDK", async () => {
    await getMessages({ search: "test query" });

    expect((sandboxClient as any).testing.messages.get).toHaveBeenCalledWith(
      123,
      { search: "test query" }
    );
  });

  it("should pass multiple parameters to SDK", async () => {
    await getMessages({ page: 1, search: "test" });

    expect((sandboxClient as any).testing.messages.get).toHaveBeenCalledWith(
      123,
      { page: 1, search: "test" }
    );
  });

  it("should pass all parameters to SDK", async () => {
    await getMessages({ page: 2, last_id: 100, search: "test query" });

    expect((sandboxClient as any).testing.messages.get).toHaveBeenCalledWith(
      123,
      { page: 2, last_id: 100, search: "test query" }
    );
  });
});
