import listInboundInboxes from "../listInboundInboxes";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    inboxes: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listInboundInboxes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns a formatted summary", async () => {
    mockClient.inbound.inboxes.getList.mockResolvedValue([
      {
        id: 473,
        name: "Tickets",
        address: "t@inbound-mailtrap.io",
        domain_id: 892,
      },
    ]);

    const result = await listInboundInboxes({ folder_id: 77 });

    expect(mockClient.inbound.inboxes.getList).toHaveBeenCalledWith(77);
    expect(result.content[0].text).toContain("Found 1 inbox(es) in folder 77");
    expect(result.content[0].text).toContain("[473] Tickets");
    expect(result.isError).toBeUndefined();
  });

  it("returns the empty message when no inboxes exist", async () => {
    mockClient.inbound.inboxes.getList.mockResolvedValue([]);

    const result = await listInboundInboxes({ folder_id: 77 });

    expect(result.content[0].text).toBe("No inboxes in folder 77.");
  });

  it("rejects invalid input", async () => {
    const result = await listInboundInboxes({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.inboxes.getList).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.inboxes.getList.mockRejectedValue(new Error("boom"));

    const result = await listInboundInboxes({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list inbound inboxes: boom");
  });
});
