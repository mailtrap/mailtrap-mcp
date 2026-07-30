import terminateEmailCampaign from "../terminateEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    terminate: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("terminateEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("terminates the campaign and returns the unwrapped campaign", async () => {
    mockClient.emailCampaigns.terminate.mockResolvedValue({
      data: { id: 4567, current_state: "terminating" },
    });

    const result = await terminateEmailCampaign({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns");
    expect(mockClient.emailCampaigns.terminate).toHaveBeenCalledWith(4567);
    expect(result.content[0].text).toContain('"current_state": "terminating"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.terminate.mockRejectedValue(
      new Error("Cannot transition from 'draft' to 'terminating'")
    );

    const result = await terminateEmailCampaign({ email_campaign_id: 4567 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to terminate email campaign: Cannot transition from 'draft' to 'terminating'"
    );
  });
});
