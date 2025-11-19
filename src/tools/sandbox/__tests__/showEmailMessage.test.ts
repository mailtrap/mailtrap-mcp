import showEmailMessage from "../showSandboxEmailMessage";
import { sandboxClient } from "../../../client";

jest.mock("../../../client", () => ({
  sandboxClient: {
    testing: {
      messages: {
        showEmailMessage: jest.fn(),
        getHtmlMessage: jest.fn(),
        getTextMessage: jest.fn(),
      },
    },
  },
}));

describe("showEmailMessage", () => {
  const mockMessage = {
    id: 1,
    from_email: "sender@example.com",
    to_email: "recipient@example.com",
    subject: "Test Subject",
    sent_at: "2024-01-01T00:00:00Z",
    is_read: false,
    html_body_size: 1000,
    text_body_size: 500,
    email_size: 2000,
  };

  const mockHtmlContent = "<html><body>Test HTML</body></html>";
  const mockTextContent = "Test text content";

  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (sandboxClient as any).testing.messages.showEmailMessage.mockResolvedValue(
      mockMessage
    );
    (sandboxClient as any).testing.messages.getHtmlMessage.mockResolvedValue(
      mockHtmlContent
    );
    (sandboxClient as any).testing.messages.getTextMessage.mockResolvedValue(
      mockTextContent
    );
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "123" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should show sandbox email message successfully with HTML and text", async () => {
    const result = await showEmailMessage({ message_id: 1 });

    expect(
      (sandboxClient as any).testing.messages.showEmailMessage
    ).toHaveBeenCalledWith(123, 1);
    expect(
      (sandboxClient as any).testing.messages.getHtmlMessage
    ).toHaveBeenCalledWith(123, 1);
    expect(
      (sandboxClient as any).testing.messages.getTextMessage
    ).toHaveBeenCalledWith(123, 1);

    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain("Message ID: 1");
    expect(result.content[0].text).toContain("sender@example.com");
    expect(result.content[0].text).toContain("Test Subject");
    expect(result.content[0].text).toContain("HTML Content");
    expect(result.content[0].text).toContain("Text Content");
    expect(result.content[0].text).toContain(mockHtmlContent);
    expect(result.content[0].text).toContain(mockTextContent);
  });

  it("should handle message without HTML content", async () => {
    (sandboxClient as any).testing.messages.getHtmlMessage.mockRejectedValue(
      new Error("No HTML")
    );

    const result = await showEmailMessage({ message_id: 1 });

    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain("Text Content");
    expect(result.content[0].text).not.toContain("HTML Content");
  });

  it("should handle message without text content", async () => {
    (sandboxClient as any).testing.messages.getTextMessage.mockRejectedValue(
      new Error("No text")
    );

    const result = await showEmailMessage({ message_id: 1 });

    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain("HTML Content");
    expect(result.content[0].text).not.toContain("Text Content");
  });

  it("should handle message without both HTML and text", async () => {
    (sandboxClient as any).testing.messages.getHtmlMessage.mockRejectedValue(
      new Error("No HTML")
    );
    (sandboxClient as any).testing.messages.getTextMessage.mockRejectedValue(
      new Error("No text")
    );

    const result = await showEmailMessage({ message_id: 1 });

    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain(
      "Message body content could not be retrieved"
    );
  });

  it("should handle null message response", async () => {
    (sandboxClient as any).testing.messages.showEmailMessage.mockResolvedValue(
      null
    );

    const result = await showEmailMessage({ message_id: 999 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Message with ID 999 not found");
  });

  it("should handle missing MAILTRAP_TEST_INBOX_ID", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;

    const result = await showEmailMessage({ message_id: 1 });

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
    const showEmailMessageModule = (await import("../showSandboxEmailMessage"))
      .default;
    const result = await showEmailMessageModule({ message_id: 1 });

    // Restore the original mock
    jest.dontMock("../../../client");
    jest.resetModules();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Sandbox client is not available");
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    (sandboxClient as any).testing.messages.showEmailMessage.mockRejectedValue(
      mockError
    );

    const result = await showEmailMessage({ message_id: 1 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to show sandbox email message");
    expect(result.content[0].text).toContain("API Error");
  });
});
