import replyAllToInboundMessage from "../replyAllToInboundMessage";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    messages: {
      replyAll: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("replyAllToInboundMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("replies to all and returns the send result as JSON", async () => {
    mockClient.inbound.messages.replyAll.mockResolvedValue({
      message_ids: ["s1", "s2"],
    });

    const result = await replyAllToInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      text: "Looping everyone in.",
    });

    expect(mockClient.inbound.messages.replyAll).toHaveBeenCalledWith(
      473,
      "m1",
      {
        text: "Looping everyone in.",
      }
    );
    expect(result.content[0].text).toContain('"message_ids"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await replyAllToInboundMessage({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.messages.replyAll).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.messages.replyAll.mockRejectedValue(new Error("boom"));

    const result = await replyAllToInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      text: "Hi",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to reply-all to inbound message: boom"
    );
  });
});
