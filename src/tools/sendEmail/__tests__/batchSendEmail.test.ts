import batchSendEmail from "../batchSendEmail";
import { requireClient } from "../../../client";

const mockClient = {
  batchSend: jest.fn(),
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("batchSendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("sends a template batch and returns the SDK response as JSON", async () => {
    mockClient.batchSend.mockResolvedValue({
      success: true,
      responses: [
        { success: true, message_ids: ["m-1"] },
        { success: true, message_ids: ["m-2"] },
      ],
    });

    const result = await batchSendEmail({
      base: {
        from: { email: "sender@example.com", name: "Sender" },
        template_uuid: "tpl-1",
        template_variables: { brand: "MCP" },
      },
      requests: [
        {
          to: "alice@example.com",
          template_variables: { name: "Alice" },
        },
        {
          to: [{ email: "bob@example.com", name: "Bob" }],
          template_variables: { name: "Bob" },
        },
      ],
    });

    expect(requireClient).toHaveBeenCalledWith("batch sending email", {
      requireAccountId: false,
    });
    expect(mockClient.batchSend).toHaveBeenCalledWith({
      base: {
        from: { email: "sender@example.com", name: "Sender" },
        template_uuid: "tpl-1",
        template_variables: { brand: "MCP" },
      },
      requests: [
        {
          to: [{ email: "alice@example.com" }],
          template_variables: { name: "Alice" },
        },
        {
          to: [{ email: "bob@example.com", name: "Bob" }],
          template_variables: { name: "Bob" },
        },
      ],
    });
    expect(result.content[0].text).toContain('"success": true');
    expect(result.content[0].text).toContain('"message_ids"');
    expect(result.isError).toBeUndefined();
  });

  it("sends an inline batch where base provides subject/text", async () => {
    mockClient.batchSend.mockResolvedValue({
      success: true,
      responses: [{ success: true, message_ids: ["m-1"] }],
    });

    await batchSendEmail({
      base: {
        from: "sender@example.com",
        subject: "Hi",
        text: "Hello there",
      },
      requests: [{ to: "alice@example.com" }],
    });

    expect(mockClient.batchSend).toHaveBeenCalledWith({
      base: {
        from: { email: "sender@example.com" },
        subject: "Hi",
        text: "Hello there",
      },
      requests: [{ to: [{ email: "alice@example.com" }] }],
    });
  });

  it("rejects an empty requests array", async () => {
    const result = await batchSendEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "'requests' must contain at least one entry"
    );
  });

  it("rejects mixing template_uuid with inline content on base", async () => {
    const result = await batchSendEmail({
      base: {
        from: "sender@example.com",
        template_uuid: "tpl-1",
        subject: "Should not be here",
      },
      requests: [{ to: "alice@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("base:");
    expect(result.content[0].text).toContain("subject");
  });

  it("requires subject when neither base nor request supplies a template", async () => {
    const result = await batchSendEmail({
      base: { from: "sender@example.com", text: "Hello" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("requests[0]:");
    expect(result.content[0].text).toContain("'subject' is required");
  });

  it("surfaces API errors", async () => {
    mockClient.batchSend.mockRejectedValue(new Error("rate limited"));

    const result = await batchSendEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to batch send email: rate limited"
    );
  });
});
