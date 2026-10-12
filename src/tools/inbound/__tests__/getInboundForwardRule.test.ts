import getInboundForwardRule from "../getInboundForwardRule";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    forwardRules: {
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getInboundForwardRule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the rule as JSON", async () => {
    mockClient.inbound.forwardRules.get.mockResolvedValue({
      data: { id: 7, name: "Billing", conditions: [], destinations: [] },
    });

    const result = await getInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
    });

    expect(mockClient.inbound.forwardRules.get).toHaveBeenCalledWith(473, 7);
    expect(JSON.parse(result.content[0].text)).toEqual({
      id: 7,
      name: "Billing",
      conditions: [],
      destinations: [],
    });
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await getInboundForwardRule({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.forwardRules.get).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.forwardRules.get.mockRejectedValue(new Error("boom"));

    const result = await getInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get inbound forward rule: boom"
    );
  });
});
