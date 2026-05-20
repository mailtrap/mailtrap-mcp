import getBillingUsage from "../getBillingUsage";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    billing: {
      getCurrentBillingCycleUsage: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getBillingUsage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns billing usage as JSON", async () => {
    mockClient.general.billing.getCurrentBillingCycleUsage.mockResolvedValue({
      billing: {
        cycle_start: "2026-05-01",
        cycle_end: "2026-05-31",
      },
      sending: {
        plan: { name: "Business" },
        usage: { sent_messages_count: { current: 1234, limit: 100000 } },
      },
      testing: {
        plan: { name: "Free" },
        usage: {
          sent_messages_count: { current: 5, limit: 100 },
          forwarded_messages_count: { current: 0, limit: 10 },
        },
      },
    });

    const result = await getBillingUsage();

    expect(requireClient).toHaveBeenCalledWith("billing");
    expect(result.content[0].text).toContain('"cycle_start": "2026-05-01"');
    expect(result.content[0].text).toContain('"current": 1234');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.general.billing.getCurrentBillingCycleUsage.mockRejectedValue(
      new Error("forbidden")
    );

    const result = await getBillingUsage();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get billing usage: forbidden"
    );
  });
});
