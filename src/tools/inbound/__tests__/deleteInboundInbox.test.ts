import deleteInboundInbox from "../deleteInboundInbox";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    inboxes: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteInboundInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes an inbox and confirms", async () => {
    mockClient.inbound.inboxes.delete.mockResolvedValue(undefined);

    const result = await deleteInboundInbox({ folder_id: 77, inbox_id: 473 });

    expect(mockClient.inbound.inboxes.delete).toHaveBeenCalledWith(77, 473);
    expect(result.content[0].text).toBe(
      "Inbound inbox 473 deleted successfully."
    );
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await deleteInboundInbox({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.inboxes.delete).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.inboxes.delete.mockRejectedValue(new Error("boom"));

    const result = await deleteInboundInbox({ folder_id: 77, inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to delete inbound inbox: boom");
  });
});
