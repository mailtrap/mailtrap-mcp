import createInboundInbox from "../createInboundInbox";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    inboxes: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createInboundInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a hosted inbox (no domain_id)", async () => {
    mockClient.inbound.inboxes.create.mockResolvedValue({
      id: 473,
      name: "Tickets",
    });

    const result = await createInboundInbox({ folder_id: 77, name: "Tickets" });

    expect(mockClient.inbound.inboxes.create).toHaveBeenCalledWith(77, {
      name: "Tickets",
    });
    expect(result.content[0].text).toContain('"name": "Tickets"');
    expect(result.isError).toBeUndefined();
  });

  it("passes domain_id for a custom-domain inbox", async () => {
    mockClient.inbound.inboxes.create.mockResolvedValue({
      id: 473,
      name: "Tickets",
    });

    await createInboundInbox({
      folder_id: 77,
      name: "Tickets",
      domain_id: 892,
    });

    expect(mockClient.inbound.inboxes.create).toHaveBeenCalledWith(77, {
      name: "Tickets",
      domain_id: 892,
    });
  });

  it("rejects invalid input", async () => {
    const result = await createInboundInbox({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.inboxes.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.inboxes.create.mockRejectedValue(new Error("boom"));

    const result = await createInboundInbox({ folder_id: 77, name: "Tickets" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to create inbound inbox: boom");
  });
});
