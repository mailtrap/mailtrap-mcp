import getInboundMessage from "../getInboundMessage";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    messages: {
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getInboundMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the message as JSON", async () => {
    mockClient.inbound.messages.get.mockResolvedValue({
      id: "m1",
      subject: "Re: Question",
    });

    const result = await getInboundMessage({ inbox_id: 473, message_id: "m1" });

    expect(mockClient.inbound.messages.get).toHaveBeenCalledWith(473, "m1");
    expect(result.content[0].text).toContain('"id": "m1"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await getInboundMessage({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.messages.get).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.messages.get.mockRejectedValue(new Error("boom"));

    const result = await getInboundMessage({ inbox_id: 473, message_id: "m1" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get inbound message: boom");
  });
});
