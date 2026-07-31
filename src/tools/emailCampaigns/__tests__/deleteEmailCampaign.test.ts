import deleteEmailCampaign from "../deleteEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the campaign and returns a confirmation payload", async () => {
    mockClient.emailCampaigns.delete.mockResolvedValue(undefined);

    const result = await deleteEmailCampaign({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.delete).toHaveBeenCalledWith(4567);
    expect(result.content[0].text).toContain('"email_campaign_id": 4567');
    expect(result.content[0].text).toContain('"deleted": true');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteEmailCampaign({ email_campaign_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete email campaign: not found"
    );
  });
});
