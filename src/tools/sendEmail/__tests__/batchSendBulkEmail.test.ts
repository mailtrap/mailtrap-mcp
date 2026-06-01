import batchSendBulkEmail from "../batchSendBulkEmail";
import { getBulkClient } from "../../../client";

const mockClient = {
  batchSend: jest.fn(),
};

jest.mock("../../../client", () => ({
  getBulkClient: jest.fn(() => mockClient),
}));

describe("batchSendBulkEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getBulkClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("uses the bulk client and forwards the SDK payload", async () => {
    mockClient.batchSend.mockResolvedValue({
      success: true,
      responses: [{ success: true, message_ids: ["m-1"] }],
    });

    const result = await batchSendBulkEmail({
      base: {
        from: { email: "sender@example.com", name: "Sender" },
        subject: "Bulk hello",
        text: "Hello bulk",
      },
      requests: [{ to: "alice@example.com" }],
    });

    expect(getBulkClient).toHaveBeenCalledTimes(1);
    expect(mockClient.batchSend).toHaveBeenCalledWith({
      base: {
        from: { email: "sender@example.com", name: "Sender" },
        subject: "Bulk hello",
        text: "Hello bulk",
      },
      requests: [{ to: [{ email: "alice@example.com" }] }],
    });
    expect(result.isError).toBeUndefined();
  });

  it("propagates payload validation errors", async () => {
    const result = await batchSendBulkEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{}],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Failed to batch send bulk email: requests[0]: provide at least one recipient"
    );
    expect(mockClient.batchSend).not.toHaveBeenCalled();
  });

  it("surfaces API errors with a bulk-specific prefix", async () => {
    mockClient.batchSend.mockRejectedValue(new Error("bulk rate limited"));

    const result = await batchSendBulkEmail({
      base: { from: "sender@example.com", subject: "Hi", text: "x" },
      requests: [{ to: "alice@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to batch send bulk email: bulk rate limited"
    );
  });
});
