import sendEmail from "../sendEmail";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    send: jest.fn(),
  },
}));

describe("sendEmail", () => {
  const mockEmailData = {
    to: "recipient@example.com",
    subject: "Test Subject",
    text: "Test email body",
    category: "test-category",
  };

  const mockResponse = {
    message_ids: ["123"],
    success: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (client.send as jest.Mock).mockResolvedValue(mockResponse);
  });

  it("should send email successfully with default from address", async () => {
    const result = await sendEmail(mockEmailData);

    expect(client.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${mockEmailData.to}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should send email successfully with custom from address", async () => {
    const customFrom = "custom@example.com";

    const result = await sendEmail({
      ...mockEmailData,
      from: customFrom,
    });

    expect(client.send).toHaveBeenCalledWith({
      from: { email: customFrom },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${mockEmailData.to}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle CC and BCC recipients", async () => {
    const cc = ["cc1@example.com", "cc2@example.com"];
    const bcc = ["bcc@example.com"];

    const result = await sendEmail({
      ...mockEmailData,
      cc,
      bcc,
    });

    expect(client.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
      cc: cc.map((email) => ({ email })),
      bcc: bcc.map((email) => ({ email })),
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${mockEmailData.to}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle HTML content", async () => {
    const html = "<p>Test HTML content</p>";

    const result = await sendEmail({
      ...mockEmailData,
      html,
    });

    expect(client.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: mockEmailData.to }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html,
      category: mockEmailData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${mockEmailData.to}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle category parameter", async () => {
    const category = "test-category";

    const result = await sendEmail({
      ...mockEmailData,
      category,
    });

    expect(client.send).toHaveBeenCalledWith({
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
          text: `Email sent successfully to ${mockEmailData.to}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle array of email addresses for 'to' property", async () => {
    const toEmails = [
      "user1@example.com",
      "user2@example.com",
      "user3@example.com",
    ];

    const result = await sendEmail({
      ...mockEmailData,
      to: toEmails,
    });

    expect(client.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: toEmails.map((email) => ({ email })),
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${toEmails.join(
            ", "
          )}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should handle single email string for 'to' property", async () => {
    const singleEmail = "single@example.com";

    const result = await sendEmail({
      ...mockEmailData,
      to: singleEmail,
    });

    expect(client.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: singleEmail }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${singleEmail}.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  describe("errors handling", () => {
    it("should throw error when neither HTML nor TEXT is provided", async () => {
      const result = await sendEmail({
        to: mockEmailData.to,
        subject: mockEmailData.subject,
        category: mockEmailData.category,
      });

      expect(client.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: Either HTML or TEXT body is required",
          },
        ],
        isError: true,
      });
    });

    it("should throw error when empty array is provided for 'to' field", async () => {
      const result = await sendEmail({
        ...mockEmailData,
        to: [],
      });

      expect(client.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: No valid recipients provided in 'to' field after normalization",
          },
        ],
        isError: true,
      });
    });

    it("should throw error when empty string is provided for 'to' field", async () => {
      const result = await sendEmail({
        ...mockEmailData,
        to: "",
      });

      expect(client.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: No valid recipients provided in 'to' field after normalization",
          },
        ],
        isError: true,
      });
    });

    it("should filter out empty email addresses and send to valid ones", async () => {
      const result = await sendEmail({
        ...mockEmailData,
        to: ["valid@example.com", "", "another@example.com"],
      });

      expect(client.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            { email: "valid@example.com" },
            { email: "another@example.com" },
          ],
        })
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Email sent successfully to valid@example.com, another@example.com.\nMessage IDs: 123\nStatus: Success",
          },
        ],
      });
    });

    it("should handle client.send failure", async () => {
      const mockError = new Error("Failed to send email");
      (client.send as jest.Mock).mockRejectedValue(mockError);

      const result = await sendEmail(mockEmailData);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: Failed to send email",
          },
        ],
        isError: true,
      });
    });
  });
});
