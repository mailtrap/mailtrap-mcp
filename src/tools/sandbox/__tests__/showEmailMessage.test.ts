import showEmailMessage from "../showSandboxEmailMessage";
import { getSandboxClient } from "../../../client";

const mockSandboxClient = {
  testing: {
    messages: {
      showEmailMessage: jest.fn(),
      getHtmlMessage: jest.fn(),
      getTextMessage: jest.fn(),
      getSpamScore: jest.fn(),
      getHtmlAnalysis: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

describe("showSandboxEmailMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "1234" });

    mockSandboxClient.testing.messages.showEmailMessage.mockResolvedValue({
      id: 99,
      from_email: "a@b.c",
      subject: "Hello",
    });
    mockSandboxClient.testing.messages.getHtmlMessage.mockResolvedValue(
      "<p>html</p>"
    );
    mockSandboxClient.testing.messages.getTextMessage.mockResolvedValue(
      "plain"
    );
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("returns the message with html/text content as JSON", async () => {
    const result = await showEmailMessage({ message_id: 99 });

    expect(
      mockSandboxClient.testing.messages.showEmailMessage
    ).toHaveBeenCalledWith(1234, 99);
    expect(result.content[0].text).toContain('"id": 99');
    expect(result.content[0].text).toContain('"html_content"');
    expect(result.content[0].text).toContain("<p>html</p>");
    expect(result.content[0].text).toContain('"text_content"');
    expect(result.content[0].text).toContain("plain");
    expect(result.isError).toBeUndefined();
  });

  it("includes spam report when requested", async () => {
    mockSandboxClient.testing.messages.getSpamScore.mockResolvedValue({
      score: 2.1,
    });

    const result = await showEmailMessage({
      message_id: 99,
      include_spam_report: true,
    });

    expect(result.content[0].text).toContain('"spam_report"');
    expect(result.content[0].text).toContain('"score": 2.1');
  });

  it("includes html analysis when requested", async () => {
    mockSandboxClient.testing.messages.getHtmlAnalysis.mockResolvedValue({
      html_compatibility_score: 90,
    });

    const result = await showEmailMessage({
      message_id: 99,
      include_html_analysis: true,
    });

    expect(result.content[0].text).toContain('"html_analysis"');
    expect(result.content[0].text).toContain('"html_compatibility_score": 90');
  });

  it("errors when message not found", async () => {
    mockSandboxClient.testing.messages.showEmailMessage.mockResolvedValue(null);
    const result = await showEmailMessage({ message_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("not found");
  });

  it("errors when no test_inbox_id available", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;
    const result = await showEmailMessage({ message_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_TEST_INBOX_ID");
  });

  it("surfaces API errors", async () => {
    mockSandboxClient.testing.messages.showEmailMessage.mockRejectedValue(
      new Error("boom")
    );
    const result = await showEmailMessage({ message_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to show sandbox email message: boom"
    );
  });
});
