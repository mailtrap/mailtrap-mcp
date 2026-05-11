import sendEmail from "../sendEmail";
import { requireClient } from "../../../client";

const mockClient = {
  send: jest.fn(),
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
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
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.send.mockResolvedValue(mockResponse);
  });

  it("should send email successfully with default from address", async () => {
    const result = await sendEmail(mockEmailData);

    expect(mockClient.send).toHaveBeenCalledWith({
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

    expect(mockClient.send).toHaveBeenCalledWith({
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

  it("should send email with custom from name when from is an object", async () => {
    const result = await sendEmail({
      ...mockEmailData,
      from: {
        email: "custom@example.com",
        name: "Acme Notifications",
      },
    });

    expect(mockClient.send).toHaveBeenCalledWith({
      from: { email: "custom@example.com", name: "Acme Notifications" },
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

    expect(mockClient.send).toHaveBeenCalledWith({
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

  it("should pass display names for to, cc, and bcc when given as objects", async () => {
    const result = await sendEmail({
      ...mockEmailData,
      to: [{ email: "to1@example.com", name: "To One" }, "to2@example.com"],
      cc: [{ email: "cc@example.com", name: "CC Name" }],
      bcc: [{ email: "bcc@example.com", name: "BCC Name" }],
    });

    expect(mockClient.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [
        { email: "to1@example.com", name: "To One" },
        { email: "to2@example.com" },
      ],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
      cc: [{ email: "cc@example.com", name: "CC Name" }],
      bcc: [{ email: "bcc@example.com", name: "BCC Name" }],
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to to1@example.com, to2@example.com.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
        },
      ],
    });
  });

  it("should accept a single to recipient as an object with a display name", async () => {
    const result = await sendEmail({
      ...mockEmailData,
      to: { email: "named@example.com", name: "Named User" },
    });

    expect(mockClient.send).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: "named@example.com", name: "Named User" }],
      subject: mockEmailData.subject,
      text: mockEmailData.text,
      html: undefined,
      category: mockEmailData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Email sent successfully to named@example.com.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
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

    expect(mockClient.send).toHaveBeenCalledWith({
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

    expect(mockClient.send).toHaveBeenCalledWith({
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

    expect(mockClient.send).toHaveBeenCalledWith({
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

    expect(mockClient.send).toHaveBeenCalledWith({
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

      expect(mockClient.send).not.toHaveBeenCalled();
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

    it("should throw error when no recipients are provided across to/cc/bcc", async () => {
      const result = await sendEmail({
        ...mockEmailData,
        to: [],
      });

      expect(mockClient.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: Provide at least one recipient via 'to', 'cc', or 'bcc'",
          },
        ],
        isError: true,
      });
    });

    it("should throw error when 'to' is empty string and no cc/bcc are provided", async () => {
      const result = await sendEmail({
        ...mockEmailData,
        to: "",
      });

      expect(mockClient.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: Provide at least one recipient via 'to', 'cc', or 'bcc'",
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

      expect(mockClient.send).toHaveBeenCalledWith(
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
      mockClient.send.mockRejectedValue(mockError);

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

  describe("cc/bcc-only sends (no 'to')", () => {
    it("should send when only cc is provided (no 'to')", async () => {
      const result = await sendEmail({
        subject: "Test Subject",
        text: "Test email body",
        cc: ["cc@example.com"],
      });

      expect(mockClient.send).toHaveBeenCalledWith({
        from: { email: "default@example.com" },
        to: [],
        subject: "Test Subject",
        text: "Test email body",
        html: undefined,
        category: undefined,
        cc: [{ email: "cc@example.com" }],
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Email sent successfully to cc@example.com.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
          },
        ],
      });
    });

    it("should send when only bcc is provided (no 'to')", async () => {
      const result = await sendEmail({
        subject: "Test Subject",
        text: "Test email body",
        bcc: [{ email: "bcc@example.com", name: "BCC User" }],
      });

      expect(mockClient.send).toHaveBeenCalledWith({
        from: { email: "default@example.com" },
        to: [],
        subject: "Test Subject",
        text: "Test email body",
        html: undefined,
        category: undefined,
        bcc: [{ email: "bcc@example.com", name: "BCC User" }],
      });

      expect(result.content[0].text).toContain(
        "Email sent successfully to bcc@example.com"
      );
    });
  });

  describe("template sends", () => {
    it("should send email using template_uuid", async () => {
      const result = await sendEmail({
        to: "recipient@example.com",
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
        template_variables: { name: "John", order_id: 1234 },
      });

      expect(mockClient.send).toHaveBeenCalledWith({
        from: { email: "default@example.com" },
        to: [{ email: "recipient@example.com" }],
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
        template_variables: { name: "John", order_id: 1234 },
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Email sent successfully to recipient@example.com.\nMessage IDs: ${mockResponse.message_ids}\nStatus: Success`,
          },
        ],
      });
    });

    it("should send template-based email without template_variables", async () => {
      await sendEmail({
        to: "recipient@example.com",
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
      });

      expect(mockClient.send).toHaveBeenCalledWith({
        from: { email: "default@example.com" },
        to: [{ email: "recipient@example.com" }],
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
        template_variables: undefined,
      });
    });

    it("should pass cc and bcc through with template sends", async () => {
      await sendEmail({
        to: "recipient@example.com",
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
        cc: ["cc@example.com"],
        bcc: [{ email: "bcc@example.com", name: "BCC User" }],
      });

      expect(mockClient.send).toHaveBeenCalledWith({
        from: { email: "default@example.com" },
        to: [{ email: "recipient@example.com" }],
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
        template_variables: undefined,
        cc: [{ email: "cc@example.com" }],
        bcc: [{ email: "bcc@example.com", name: "BCC User" }],
      });
    });

    it("should reject template_uuid combined with subject/text/html/category", async () => {
      const result = await sendEmail({
        to: "recipient@example.com",
        template_uuid: "b81aabcd-1a1e-41cf-91b6-eca0254b3d96",
        subject: "Should not be here",
        text: "Body",
        category: "promo",
      });

      expect(mockClient.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: When 'template_uuid' is set, the following fields must be omitted: subject, text, category",
          },
        ],
        isError: true,
      });
    });

    it("should reject template_variables without template_uuid", async () => {
      const result = await sendEmail({
        to: "recipient@example.com",
        subject: "Hello",
        text: "Body",
        template_variables: { name: "John" },
      });

      expect(mockClient.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: 'template_variables' can only be used together with 'template_uuid'",
          },
        ],
        isError: true,
      });
    });

    it("should require subject for inline (non-template) sends", async () => {
      const result = await sendEmail({
        to: "recipient@example.com",
        text: "Body",
      });

      expect(mockClient.send).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to send email: 'subject' is required when not using a template",
          },
        ],
        isError: true,
      });
    });
  });
});
