import deleteInboundForwardRule from "../deleteInboundForwardRule";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    forwardRules: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteInboundForwardRule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes a rule and confirms", async () => {
    mockClient.inbound.forwardRules.delete.mockResolvedValue(undefined);

    const result = await deleteInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
    });

    expect(mockClient.inbound.forwardRules.delete).toHaveBeenCalledWith(473, 7);
    expect(result.content[0].text).toBe(
      "Inbound forward rule 7 deleted successfully."
    );
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await deleteInboundForwardRule({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.forwardRules.delete).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.forwardRules.delete.mockRejectedValue(new Error("boom"));

    const result = await deleteInboundForwardRule({
      inbox_id: 473,
      forward_rule_id: 7,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete inbound forward rule: boom"
    );
  });
});
