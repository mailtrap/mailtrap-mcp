import updateInboundForwardRule from "../updateInboundForwardRule";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    forwardRules: {
      update: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateInboundForwardRule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("sends only the provided fields and returns the rule as JSON", async () => {
    mockClient.inbound.forwardRules.update.mockResolvedValue({
      data: { id: 7, name: "Renamed" },
    });

    const result = await updateInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
      name: "Renamed",
    });

    expect(mockClient.inbound.forwardRules.update).toHaveBeenCalledWith(
      473,
      7,
      { name: "Renamed" }
    );
    expect(result.content[0].text).toContain('"name": "Renamed"');
    expect(result.isError).toBeUndefined();
  });

  it("passes empty arrays through to clear conditions and destinations", async () => {
    mockClient.inbound.forwardRules.update.mockResolvedValue({
      data: { id: 7, conditions: [], destinations: [] },
    });

    await updateInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
      conditions: [],
      destinations: [],
    });

    expect(mockClient.inbound.forwardRules.update).toHaveBeenCalledWith(
      473,
      7,
      { conditions: [], destinations: [] }
    );
  });

  it("rejects an update with no fields", async () => {
    const result = await updateInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Provide at least one field to update."
    );
    expect(mockClient.inbound.forwardRules.update).not.toHaveBeenCalled();
  });

  it("rejects invalid input", async () => {
    const result = await updateInboundForwardRule({
      inbox_id: 473,
      name: "X",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.forwardRules.update).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.forwardRules.update.mockRejectedValue(new Error("boom"));

    const result = await updateInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
      name: "X",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update inbound forward rule: boom"
    );
  });
});
