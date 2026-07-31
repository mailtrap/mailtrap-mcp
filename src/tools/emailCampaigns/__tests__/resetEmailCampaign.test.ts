import resetEmailCampaign from "../resetEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    reset: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("resetEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("resets the campaign and returns the unwrapped campaign", async () => {
    mockClient.emailCampaigns.reset.mockResolvedValue({
      data: { id: 4567, current_state: "draft" },
    });

    const result = await resetEmailCampaign({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.reset).toHaveBeenCalledWith(4567);
    expect(result.content[0].text).toContain('"current_state": "draft"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.reset.mockRejectedValue(
      new Error("Campaign is not scheduled")
    );

    const result = await resetEmailCampaign({ email_campaign_id: 4567 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to reset email campaign: Campaign is not scheduled"
    );
  });
});
