import createInboundForwardRule from "../createInboundForwardRule";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    forwardRules: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createInboundForwardRule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a rule with conditions and destinations", async () => {
    mockClient.inbound.forwardRules.create.mockResolvedValue({
      data: { id: 7, name: "Billing" },
    });

    const result = await createInboundForwardRule({
      inbox_id: 473,
      name: "Billing",
      conditions: [
        {
          match_type: "sender",
          operator: "ends_with",
          value: "@billing.example.com",
        },
        {
          match_type: "header",
          operator: "not_empty",
          header_key: "X-Priority",
        },
      ],
      destinations: [{ email: "finance@example.com" }],
    });

    expect(mockClient.inbound.forwardRules.create).toHaveBeenCalledWith(473, {
      name: "Billing",
      conditions: [
        {
          match_type: "sender",
          operator: "ends_with",
          value: "@billing.example.com",
        },
        {
          match_type: "header",
          operator: "not_empty",
          header_key: "X-Priority",
        },
      ],
      destinations: [{ email: "finance@example.com" }],
    });
    expect(result.content[0].text).toContain('"name": "Billing"');
    expect(result.isError).toBeUndefined();
  });

  it("sends only the name when conditions and destinations are omitted", async () => {
    mockClient.inbound.forwardRules.create.mockResolvedValue({
      data: { id: 7, name: "Archive" },
    });

    await createInboundForwardRule({ inbox_id: 473, name: "Archive" });

    expect(mockClient.inbound.forwardRules.create).toHaveBeenCalledWith(473, {
      name: "Archive",
    });
  });

  it("rejects a missing name", async () => {
    const result = await createInboundForwardRule({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.forwardRules.create).not.toHaveBeenCalled();
  });

  it("rejects an unknown operator", async () => {
    const result = await createInboundForwardRule({
      inbox_id: 473,
      name: "Billing",
      conditions: [{ match_type: "sender", operator: "matches", value: "x" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("conditions.0.operator");
    expect(mockClient.inbound.forwardRules.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.forwardRules.create.mockRejectedValue(new Error("boom"));

    const result = await createInboundForwardRule({
      inbox_id: 473,
      name: "Billing",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create inbound forward rule: boom"
    );
  });
});
