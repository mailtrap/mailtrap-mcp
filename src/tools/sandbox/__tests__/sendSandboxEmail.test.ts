import sendSandboxEmail from "../sendSandboxEmail";
import { getSandboxClient } from "../../../client";

const mockSend = jest.fn();
const mockSandboxClient = { send: mockSend };

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

describe("sendSandboxEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, {
      MAILTRAP_TEST_INBOX_ID: "1234",
      DEFAULT_FROM_EMAIL: "default@example.com",
    });
    mockSend.mockResolvedValue({ message_ids: ["abc"], success: true });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("sends a sandbox email and returns summary + JSON", async () => {
    const result = await sendSandboxEmail({
      to: "user@example.com",
      subject: "Hi",
      text: "Hello",
    });

    expect(getSandboxClient).toHaveBeenCalledWith(1234);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: { email: "default@example.com" },
        to: [{ email: "user@example.com" }],
        subject: "Hi",
        text: "Hello",
      })
    );
    expect(result.content[0].text).toContain(
      "Sandbox email sent to user@example.com"
    );
    expect(result.content[0].text).toContain('"message_ids"');
    expect(result.content[0].text).toContain('"success": true');
    expect(result.isError).toBeUndefined();
  });

  it("supports template_uuid sends", async () => {
    await sendSandboxEmail({
      to: "user@example.com",
      template_uuid: "tpl-1",
      template_variables: { name: "Alice" },
    });

    expect(mockSend).toHaveBeenCalledWith({
      from: { email: "default@example.com" },
      to: [{ email: "user@example.com" }],
      template_uuid: "tpl-1",
      template_variables: { name: "Alice" },
    });
  });

  it("rejects template_uuid combined with inline content", async () => {
    const result = await sendSandboxEmail({
      to: "user@example.com",
      template_uuid: "tpl-1",
      subject: "Should not be here",
      text: "Body",
    });

    expect(mockSend).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("When 'template_uuid' is set");
  });

  it("requires subject for inline sends", async () => {
    const result = await sendSandboxEmail({
      to: "user@example.com",
      text: "Body",
    });

    expect(mockSend).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("'subject' is required");
  });

  it("errors when no test_inbox_id available", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;
    const result = await sendSandboxEmail({
      to: "x@y.z",
      subject: "Hi",
      text: "Body",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_TEST_INBOX_ID");
  });

  it("surfaces API errors", async () => {
    mockSend.mockRejectedValue(new Error("rate limited"));
    const result = await sendSandboxEmail({
      to: "user@example.com",
      subject: "Hi",
      text: "Hello",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to send sandbox email: rate limited"
    );
  });
});
