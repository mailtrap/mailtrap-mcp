import getEmailCampaignStats from "../getEmailCampaignStats";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    getStats: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getEmailCampaignStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("unwraps the data envelope and returns the stats as JSON", async () => {
    mockClient.emailCampaigns.getStats.mockResolvedValue({
      data: { sent_count: 1500, delivery_count: 1450, open_rate: 0.5655 },
    });

    const result = await getEmailCampaignStats({ email_campaign_id: 4567 });

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.getStats).toHaveBeenCalledWith(
      4567,
      undefined
    );
    expect(result.content[0].text).toContain('"sent_count": 1500');
    expect(result.content[0].text).toContain('"open_rate": 0.5655');
    expect(result.isError).toBeUndefined();
  });

  it("passes the date window to the client when provided", async () => {
    mockClient.emailCampaigns.getStats.mockResolvedValue({
      data: { sent_count: 100 },
    });

    const result = await getEmailCampaignStats({
      email_campaign_id: 4567,
      start_date: "2026-05-01",
      end_date: "2026-05-31",
    });

    expect(mockClient.emailCampaigns.getStats).toHaveBeenCalledWith(4567, {
      start_date: "2026-05-01",
      end_date: "2026-05-31",
    });
    expect(result.isError).toBeUndefined();
  });

  it("rejects dates that are not in YYYY-MM-DD format", async () => {
    const result = await getEmailCampaignStats({
      email_campaign_id: 4567,
      start_date: "invalid",
      end_date: "2026-05-31T00:00:00Z",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("start_date");
    expect(result.content[0].text).toContain("end_date");
    expect(mockClient.emailCampaigns.getStats).not.toHaveBeenCalled();
  });

  it("rejects an invalid campaign ID", async () => {
    const result = await getEmailCampaignStats({ email_campaign_id: 0 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("email_campaign_id");
    expect(mockClient.emailCampaigns.getStats).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.getStats.mockRejectedValue(
      new Error("not found")
    );

    const result = await getEmailCampaignStats({ email_campaign_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get email campaign stats: not found"
    );
  });
});
