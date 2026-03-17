import sendSandboxEmail from "../sendSandboxEmail";
import { sandboxClient } from "../../../client";

jest.mock("../../../client", () => ({
  sandboxClient: {
    send: jest.fn(),
  },
}));

describe("sendSandboxEmail", () => {
  const mockEmailData = {
    from: "default@example.com",
    to: "recipient@example.com",
    subject: "Test Subject",
    text: "Test email body",
  };

  const mockResponse = {
    message_ids: ["123"],
    success: true,
  };

  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (sandboxClient as any).send.mockResolvedValue(mockResponse);
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "123" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should send sandbox email successfully with default from address", async () => {
    const result = await sendSandboxEmail(mockEmailData);

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${
            mockEmailData.to
          }.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should send sandbox email successfully with custom from address", async () => {
    const customFrom = "custom@example.com";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      from: customFrom,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: customFrom },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${
            mockEmailData.to
          }.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle CC and BCC recipients", async () => {
    const cc = ["cc1@example.com", "cc2@example.com"];
    const bcc = ["bcc@example.com"];

    const result = await sendSandboxEmail({
      ...mockEmailData,
      cc,
      bcc,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: undefined,
      cc: cc.map((email) => ({ email })),
      bcc: bcc.map((email) => ({ email })),
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${
            mockEmailData.to
          }.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle HTML content", async () => {
    const html = "<p>Test HTML content</p>";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      html,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${
            mockEmailData.to
          }.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle HTML-only content with text explicitly undefined", async () => {
    const html = "<p>Test HTML-only content</p>";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      text: undefined,
      html,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: undefined,
      html,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${
            mockEmailData.to
          }.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle category parameter", async () => {
    const category = "test-category";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      category,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${
            mockEmailData.to
          }.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle comma-separated email addresses for 'to' property", async () => {
    const toEmails = "user1@example.com, user2@example.com, user3@example.com";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      to: toEmails,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [
        { email: "user1@example.com" },
        { email: "user2@example.com" },
        { email: "user3@example.com" },
      ],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to user1@example.com, user2@example.com, user3@example.com.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle single email string for 'to' property", async () => {
    const singleEmail = "single@example.com";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      to: singleEmail,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: singleEmail }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${singleEmail}.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle multiple recipients in 'to' field", async () => {
    const multipleRecipients = "recipient1@example.com, recipient2@example.com";

    const result = await sendSandboxEmail({
      ...mockEmailData,
      to: multipleRecipients,
    });

    expect((sandboxClient as any).send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [
        { email: "recipient1@example.com" },
        { email: "recipient2@example.com" },
      ],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to recipient1@example.com, recipient2@example.com.\nMessage IDs: ${mockResponse.message_ids.join(
            ", "
          )}\nStatus: Success`,
        },
      ],
    });
  });

  describe("errors handling", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("should throw error when MAILTRAP_TEST_INBOX_ID is not set", async () => {
      delete process.env.MAILTRAP_TEST_INBOX_ID;

      const result = await sendSandboxEmail(mockEmailData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending sandbox email:",
        expect.anything()
      );
      expect((sandboxClient as any).send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send sandbox email: MAILTRAP_TEST_INBOX_ID environment variable is required for sandbox mode",
          },
        ],
        isError: true,
      });
    });

    it("should throw error when neither HTML nor TEXT is provided", async () => {
      const result = await sendSandboxEmail({
        from: "default@example.com",
        to: mockEmailData.to,
        subject: mockEmailData.subject,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending sandbox email:",
        expect.anything()
      );
      expect((sandboxClient as any).send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send sandbox email: Either HTML or TEXT body is required",
          },
        ],
        isError: true,
      });
    });

    it("should handle client.send failure", async () => {
      const mockError = new Error("Failed to send sandbox email");
      (sandboxClient as any).send.mockRejectedValue(mockError);

      const result = await sendSandboxEmail(mockEmailData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending sandbox email:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send sandbox email: Failed to send sandbox email",
          },
        ],
        isError: true,
      });
    });
  });
});
