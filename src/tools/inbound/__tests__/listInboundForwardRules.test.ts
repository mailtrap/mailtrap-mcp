import listInboundForwardRules from "../listInboundForwardRules";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    forwardRules: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listInboundForwardRules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns a formatted summary", async () => {
    mockClient.inbound.forwardRules.getList.mockResolvedValue({
      data: [
        {
          id: 7,
          name: "Billing",
          conditions: [
            {
              match_type: "sender",
              operator: "ends_with",
              value: "@billing.example.com",
              header_key: null,
            },
          ],
          destinations: [
            { email: "finance@example.com" },
            { email: "accounting@example.com" },
          ],
        },
        { id: 8, name: "Archive", conditions: [], destinations: [] },
      ],
    });

    const result = await listInboundForwardRules({ inbox_id: 473 });

    expect(mockClient.inbound.forwardRules.getList).toHaveBeenCalledWith(473);
    expect(result.content[0].text).toContain(
      "Found 2 forward rule(s) in inbox 473"
    );
    expect(result.content[0].text).toContain(
      "[7] Billing — 1 condition(s) → finance@example.com, accounting@example.com"
    );
    expect(result.content[0].text).toContain(
      "[8] Archive — 0 condition(s) → no destinations"
    );
    expect(result.isError).toBeUndefined();
  });

  it("returns the empty message when no rules exist", async () => {
    mockClient.inbound.forwardRules.getList.mockResolvedValue({ data: [] });

    const result = await listInboundForwardRules({ inbox_id: 473 });

    expect(result.content[0].text).toBe("No forward rules in inbox 473.");
  });

  it("rejects invalid input", async () => {
    const result = await listInboundForwardRules({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.forwardRules.getList).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.forwardRules.getList.mockRejectedValue(
      new Error("boom")
    );

    const result = await listInboundForwardRules({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list inbound forward rules: boom"
    );
  });
});
