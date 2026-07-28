import getInboundInbox from "../getInboundInbox";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    inboxes: {
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getInboundInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the inbox as JSON", async () => {
    mockClient.inbound.inboxes.get.mockResolvedValue({
      id: 473,
      name: "Tickets",
    });

    const result = await getInboundInbox({ folder_id: 77, inbox_id: 473 });

    expect(mockClient.inbound.inboxes.get).toHaveBeenCalledWith(77, 473);
    expect(result.content[0].text).toContain('"id": 473');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await getInboundInbox({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.inboxes.get).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.inboxes.get.mockRejectedValue(new Error("boom"));

    const result = await getInboundInbox({ folder_id: 77, inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get inbound inbox: boom");
  });
});
