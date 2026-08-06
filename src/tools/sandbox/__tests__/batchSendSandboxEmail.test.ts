import batchSendSandboxEmail from "../batchSendSandboxEmail";
import { getSandboxClient } from "../../../client";

const mockClient = {
  batchSend: jest.fn(),
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockClient),
}));

describe("batchSendSandboxEmail", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockClient);
    process.env = { ...originalEnv };
    delete process.env.MAILTRAP_SANDBOX_ID;
    delete process.env.MAILTRAP_TEST_INBOX_ID;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("uses the sandbox client for the given inbox and forwards the SDK payload", async () => {
    mockClient.batchSend.mockResolvedValue({
      success: true,
      responses: [{ success: true, message_ids: ["m-1"] }],
    });

    const result = await batchSendSandboxEmail({
      sandbox_id: 4242,
      base: {
        from: { email: "sender@example.com", name: "Sender" },
        subject: "Sandbox hello",
        text: "Hello sandbox",
      },
      requests: [{ to: "alice@example.com" }],
    });

    expect(getSandboxClient).toHaveBeenCalledWith(4242);
    expect(mockClient.batchSend).toHaveBeenCalledWith({
      base: {
        from: { email: "sender@example.com", name: "Sender" },
        subject: "Sandbox hello",
        text: "Hello sandbox",
      },
      requests: [{ to: [{ email: "alice@example.com" }] }],
    });
    expect(result.isError).toBeUndefined();
  });

  it("does not forward sandbox_id into the SDK payload", async () => {
    mockClient.batchSend.mockResolvedValue({ success: true, responses: [] });

    await batchSendSandboxEmail({
      sandbox_id: 4242,
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    const payload = mockClient.batchSend.mock.calls[0][0];
    expect(payload.base).not.toHaveProperty("sandbox_id");
    expect(payload).not.toHaveProperty("sandbox_id");
  });

  it("falls back to MAILTRAP_SANDBOX_ID when sandbox_id is omitted", async () => {
    process.env.MAILTRAP_SANDBOX_ID = "777";
    mockClient.batchSend.mockResolvedValue({ success: true, responses: [] });

    const result = await batchSendSandboxEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(getSandboxClient).toHaveBeenCalledWith(777);
    expect(result.isError).toBeUndefined();
  });

  it("falls back to the legacy MAILTRAP_TEST_INBOX_ID, but MAILTRAP_SANDBOX_ID wins", async () => {
    process.env.MAILTRAP_TEST_INBOX_ID = "777";
    mockClient.batchSend.mockResolvedValue({ success: true, responses: [] });

    await batchSendSandboxEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(getSandboxClient).toHaveBeenCalledWith(777);

    process.env.MAILTRAP_SANDBOX_ID = "888";

    await batchSendSandboxEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(getSandboxClient).toHaveBeenLastCalledWith(888);
  });

  it("errors when no sandbox is configured", async () => {
    const result = await batchSendSandboxEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to batch send sandbox email: Provide sandbox_id or set MAILTRAP_SANDBOX_ID environment variable for sandbox mode"
    );
    expect(mockClient.batchSend).not.toHaveBeenCalled();
  });

  it("propagates payload validation errors", async () => {
    const result = await batchSendSandboxEmail({
      sandbox_id: 4242,
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{}],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Failed to batch send sandbox email: requests[0]: provide at least one recipient"
    );
    expect(mockClient.batchSend).not.toHaveBeenCalled();
  });

  it("surfaces API errors with a sandbox-specific prefix", async () => {
    mockClient.batchSend.mockRejectedValue(new Error("inbox is full"));

    const result = await batchSendSandboxEmail({
      sandbox_id: 4242,
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to batch send sandbox email: inbox is full"
    );
  });
});
