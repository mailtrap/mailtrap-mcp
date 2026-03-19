import showEmailMessage from "../showSandboxEmailMessage";
import { getSandboxClient } from "../../../client";

const mockShowEmailMessage = jest.fn();
const mockGetHtmlMessage = jest.fn();
const mockGetTextMessage = jest.fn();
const mockGetSpamScore = jest.fn();
const mockGetHtmlAnalysis = jest.fn();

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => ({
    testing: {
      messages: {
        showEmailMessage: mockShowEmailMessage,
        getHtmlMessage: mockGetHtmlMessage,
        getTextMessage: mockGetTextMessage,
        getSpamScore: mockGetSpamScore,
        getHtmlAnalysis: mockGetHtmlAnalysis,
      },
    },
  })),
}));

describe("showEmailMessage", () => {
  const inboxId = 123;
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
    mockShowEmailMessage.mockResolvedValue(mockMessage);
    mockGetHtmlMessage.mockResolvedValue(mockHtmlContent);
    mockGetTextMessage.mockResolvedValue(mockTextContent);
    (getSandboxClient as jest.Mock).mockReturnValue({
      testing: {
        messages: {
          showEmailMessage: mockShowEmailMessage,
          getHtmlMessage: mockGetHtmlMessage,
          getTextMessage: mockGetTextMessage,
          getSpamScore: mockGetSpamScore,
          getHtmlAnalysis: mockGetHtmlAnalysis,
        },
      },
    });
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: String(inboxId) });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should show sandbox email message successfully with HTML and text", async () => {
    const result = await showEmailMessage({ message_id: 1 });

    expect(mockShowEmailMessage).toHaveBeenCalledWith(inboxId, 1);
    expect(mockGetHtmlMessage).toHaveBeenCalledWith(inboxId, 1);
    expect(mockGetTextMessage).toHaveBeenCalledWith(inboxId, 1);

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
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    mockGetHtmlMessage.mockRejectedValue(new Error("No HTML"));

    const result = await showEmailMessage({ message_id: 1 });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Could not retrieve HTML content:",
      expect.any(Error)
    );
    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain("Text Content");
    expect(result.content[0].text).not.toContain("HTML Content");
    consoleWarnSpy.mockRestore();
  });

  it("should handle message without text content", async () => {
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    mockGetTextMessage.mockRejectedValue(new Error("No text"));

    const result = await showEmailMessage({ message_id: 1 });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Could not retrieve text content:",
      expect.any(Error)
    );
    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain("HTML Content");
    expect(result.content[0].text).not.toContain("Text Content");
    consoleWarnSpy.mockRestore();
  });

  it("should handle message without both HTML and text", async () => {
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    mockGetHtmlMessage.mockRejectedValue(new Error("No HTML"));
    mockGetTextMessage.mockRejectedValue(new Error("No text"));

    const result = await showEmailMessage({ message_id: 1 });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Could not retrieve HTML content:",
      expect.any(Error)
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Could not retrieve text content:",
      expect.any(Error)
    );
    expect(result.content[0].text).toContain("Sandbox Email Message Details");
    expect(result.content[0].text).toContain(
      "Message body content could not be retrieved"
    );
    consoleWarnSpy.mockRestore();
  });

  it("should handle null message response", async () => {
    mockShowEmailMessage.mockResolvedValue(null);

    const result = await showEmailMessage({ message_id: 999 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Message with ID 999 not found");
  });

  it("should handle missing test_inbox_id and MAILTRAP_TEST_INBOX_ID", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    delete process.env.MAILTRAP_TEST_INBOX_ID;

    const result = await showEmailMessage({ message_id: 1 });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error showing sandbox email message:",
      expect.anything()
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Provide test_inbox_id or set MAILTRAP_TEST_INBOX_ID"
    );
    consoleErrorSpy.mockRestore();
  });

  it("should use test_inbox_id parameter when provided", async () => {
    const result = await showEmailMessage({
      test_inbox_id: 456,
      message_id: 1,
    });

    expect(getSandboxClient).toHaveBeenCalledWith(456);
    expect(mockShowEmailMessage).toHaveBeenCalledWith(456, 1);
    expect(result.content[0].text).toContain("Sandbox Email Message Details");
  });

  it("should include spam report when include_spam_report is true", async () => {
    const mockSpamReport = {
      res: {
        score: 2.5,
        report: "SpamAssassin report",
        rules: ["RULE_A", "RULE_B"],
      },
    };
    mockGetSpamScore.mockResolvedValue(mockSpamReport);

    const result = await showEmailMessage({
      message_id: 1,
      include_spam_report: true,
    });

    expect(mockGetSpamScore).toHaveBeenCalledWith(inboxId, 1);
    expect(result.content[0].text).toContain("--- Spam Report ---");
    expect(result.content[0].text).toContain("Spam score: 2.5");
    expect(result.content[0].text).toContain("SpamAssassin report");
    expect(result.content[0].text).toContain("RULE_A");
  });

  it("should include HTML analysis when include_html_analysis is true", async () => {
    const mockHtmlAnalysis = {
      html_compatibility_score: 85,
      text_compatibility_score: 100,
      problematic_elements: ["max-width", "style tag"],
    };
    mockGetHtmlAnalysis.mockResolvedValue(mockHtmlAnalysis);

    const result = await showEmailMessage({
      message_id: 1,
      include_html_analysis: true,
    });

    expect(mockGetHtmlAnalysis).toHaveBeenCalledWith(inboxId, 1);
    expect(result.content[0].text).toContain("--- HTML Analysis ---");
    expect(result.content[0].text).toContain("HTML compatibility score: 85");
    expect(result.content[0].text).toContain("Text compatibility score: 100");
    expect(result.content[0].text).toContain("max-width");
  });

  it("should not call getSpamScore or getHtmlAnalysis when flags are false", async () => {
    await showEmailMessage({ message_id: 1 });

    expect(mockGetSpamScore).not.toHaveBeenCalled();
    expect(mockGetHtmlAnalysis).not.toHaveBeenCalled();
  });

  it("should handle spam report fetch failure gracefully", async () => {
    mockGetSpamScore.mockRejectedValue(new Error("Spam API error"));
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const result = await showEmailMessage({
      message_id: 1,
      include_spam_report: true,
    });

    expect(result.content[0].text).toContain("--- Spam Report ---");
    expect(result.content[0].text).toContain(
      "Spam report could not be retrieved"
    );
    consoleWarnSpy.mockRestore();
  });

  it("should handle HTML analysis fetch failure gracefully", async () => {
    mockGetHtmlAnalysis.mockRejectedValue(new Error("Analyze API error"));
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const result = await showEmailMessage({
      message_id: 1,
      include_html_analysis: true,
    });

    expect(result.content[0].text).toContain("--- HTML Analysis ---");
    expect(result.content[0].text).toContain(
      "HTML analysis could not be retrieved"
    );
    consoleWarnSpy.mockRestore();
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    mockShowEmailMessage.mockRejectedValue(mockError);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await showEmailMessage({ message_id: 1 });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error showing sandbox email message:",
      mockError
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Failed to show sandbox email message"
    );
    expect(result.content[0].text).toContain("API Error");
    consoleErrorSpy.mockRestore();
  });
});
