import forwardInboundMessage from "../forwardInboundMessage";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    messages: {
      forward: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("forwardInboundMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("forwards and returns the send result as JSON", async () => {
    mockClient.inbound.messages.forward.mockResolvedValue({
      message_ids: ["s1"],
    });

    const result = await forwardInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      to: [{ email: "colleague@example.com" }],
      text: "Please take a look.",
    });

    expect(mockClient.inbound.messages.forward).toHaveBeenCalledWith(
      473,
      "m1",
      {
        to: [{ email: "colleague@example.com" }],
        text: "Please take a look.",
      }
    );
    expect(result.content[0].text).toContain('"message_ids"');
    expect(result.isError).toBeUndefined();
  });

  it("normalizes a bare email string in `to`", async () => {
    mockClient.inbound.messages.forward.mockResolvedValue({
      message_ids: ["s1"],
    });

    await forwardInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      to: "colleague@example.com",
    });

    expect(mockClient.inbound.messages.forward).toHaveBeenCalledWith(
      473,
      "m1",
      {
        to: [{ email: "colleague@example.com" }],
      }
    );
  });

  it("requires at least one recipient", async () => {
    const result = await forwardInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      text: "Please take a look.",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("at least one recipient");
    expect(mockClient.inbound.messages.forward).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.messages.forward.mockRejectedValue(new Error("boom"));

    const result = await forwardInboundMessage({
      inbox_id: 473,
      message_id: "m1",
      to: [{ email: "colleague@example.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to forward inbound message: boom"
    );
  });
});
