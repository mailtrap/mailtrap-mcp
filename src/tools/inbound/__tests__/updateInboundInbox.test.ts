import updateInboundInbox from "../updateInboundInbox";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    inboxes: {
      update: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateInboundInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates an inbox and returns it as JSON", async () => {
    mockClient.inbound.inboxes.update.mockResolvedValue({
      id: 473,
      name: "Renamed",
    });

    const result = await updateInboundInbox({
      folder_id: 77,
      inbox_id: 473,
      name: "Renamed",
    });

    expect(mockClient.inbound.inboxes.update).toHaveBeenCalledWith(77, 473, {
      name: "Renamed",
    });
    expect(result.content[0].text).toContain('"name": "Renamed"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await updateInboundInbox({ folder_id: 77, inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.inboxes.update).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.inboxes.update.mockRejectedValue(new Error("boom"));

    const result = await updateInboundInbox({
      folder_id: 77,
      inbox_id: 473,
      name: "X",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to update inbound inbox: boom");
  });
});
