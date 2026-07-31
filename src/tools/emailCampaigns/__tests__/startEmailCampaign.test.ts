import startEmailCampaign from "../startEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    start: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("startEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("starts the campaign and returns the unwrapped campaign", async () => {
    mockClient.emailCampaigns.start.mockResolvedValue({
      data: { id: 4567, current_state: "started" },
    });

    const result = await startEmailCampaign({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.start).toHaveBeenCalledWith(4567);
    expect(result.content[0].text).toContain('"current_state": "started"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.start.mockRejectedValue(
      new Error("Campaign design can't be blank")
    );

    const result = await startEmailCampaign({ email_campaign_id: 4567 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to start email campaign: Campaign design can't be blank"
    );
  });
});
