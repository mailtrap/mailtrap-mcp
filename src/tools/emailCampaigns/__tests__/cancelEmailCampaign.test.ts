import cancelEmailCampaign from "../cancelEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    cancel: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("cancelEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("cancels the campaign and returns the unwrapped campaign", async () => {
    mockClient.emailCampaigns.cancel.mockResolvedValue({
      data: { id: 4567, current_state: "draft" },
    });

    const result = await cancelEmailCampaign({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.cancel).toHaveBeenCalledWith(4567);
    expect(result.content[0].text).toContain('"current_state": "draft"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.cancel.mockRejectedValue(
      new Error("Campaign is not scheduled")
    );

    const result = await cancelEmailCampaign({ email_campaign_id: 4567 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to cancel email campaign: Campaign is not scheduled"
    );
  });
});
