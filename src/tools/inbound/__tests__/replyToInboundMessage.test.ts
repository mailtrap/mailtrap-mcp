import replyToInboundMessage from "../replyToInboundMessage";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    messages: {
      reply: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("replyToInboundMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("replies and returns the send result as JSON", async () => {
    mockClient.inbound.messages.reply.mockResolvedValue({
      message_ids: ["s1"],
    });

    const result = await replyToInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      text: "Thanks!",
    });

    expect(mockClient.inbound.messages.reply).toHaveBeenCalledWith(473, "m1", {
      text: "Thanks!",
    });
    expect(result.content[0].text).toContain('"message_ids"');
    expect(result.isError).toBeUndefined();
  });

  it("normalizes a bare email string in an address field", async () => {
    mockClient.inbound.messages.reply.mockResolvedValue({
      message_ids: ["s1"],
    });

    await replyToInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      reply_to: "ops@example.com",
      text: "Thanks!",
    });

    expect(mockClient.inbound.messages.reply).toHaveBeenCalledWith(473, "m1", {
      reply_to: { email: "ops@example.com" },
      text: "Thanks!",
    });
  });

  it("rejects invalid input", async () => {
    const result = await replyToInboundMessage({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.messages.reply).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.messages.reply.mockRejectedValue(new Error("boom"));

    const result = await replyToInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      text: "Thanks!",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to reply to inbound message: boom"
    );
  });
});
