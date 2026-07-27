import deleteInboundMessage from "../deleteInboundMessage";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    messages: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteInboundMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes a message and confirms", async () => {
    mockClient.inbound.messages.delete.mockResolvedValue(undefined);

    const result = await deleteInboundMessage({
      inbox_id: 473,
      message_id: "m1",
    });

    expect(mockClient.inbound.messages.delete).toHaveBeenCalledWith(473, "m1");
    expect(result.content[0].text).toBe(
      "Inbound message m1 deleted successfully."
    );
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await deleteInboundMessage({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.messages.delete).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.messages.delete.mockRejectedValue(new Error("boom"));

    const result = await deleteInboundMessage({
      inbox_id: 473,
      message_id: "m1",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete inbound message: boom"
    );
  });
});
