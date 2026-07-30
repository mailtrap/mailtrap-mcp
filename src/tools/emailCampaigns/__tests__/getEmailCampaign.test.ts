import getEmailCampaign from "../getEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("unwraps the data envelope and returns the campaign as JSON", async () => {
    mockClient.emailCampaigns.get.mockResolvedValue({
      data: { id: 4567, name: "Spring Sale", current_state: "draft" },
    });

    const result = await getEmailCampaign({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns");
    expect(mockClient.emailCampaigns.get).toHaveBeenCalledWith(4567);
    expect(result.content[0].text).toContain('"id": 4567');
    expect(result.content[0].text).toContain('"name": "Spring Sale"');
    expect(result.content[0].text).not.toContain('"data"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.get.mockRejectedValue(new Error("not found"));

    const result = await getEmailCampaign({ email_campaign_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get email campaign: not found"
    );
  });
});
