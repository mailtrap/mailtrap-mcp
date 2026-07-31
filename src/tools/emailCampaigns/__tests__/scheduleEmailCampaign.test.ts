import scheduleEmailCampaign from "../scheduleEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    schedule: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

describe("scheduleEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("schedules the campaign and returns the unwrapped campaign", async () => {
    const datetime = isoDaysFromNow(7);
    mockClient.emailCampaigns.schedule.mockResolvedValue({
      data: {
        id: 4567,
        current_state: "scheduled",
        current_state_metadata: { scheduled_at: datetime },
      },
    });

    const result = await scheduleEmailCampaign({
      email_campaign_id: 4567,
      datetime,
    });

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.schedule).toHaveBeenCalledWith(4567, {
      datetime,
    });
    expect(result.content[0].text).toContain('"current_state": "scheduled"');
    expect(result.content[0].text).toContain(`"scheduled_at": "${datetime}"`);
    expect(result.isError).toBeUndefined();
  });

  it("accepts an ISO 8601 datetime with a timezone offset", async () => {
    const withOffset = isoDaysFromNow(7).replace("Z", "+02:00");
    mockClient.emailCampaigns.schedule.mockResolvedValue({
      data: { id: 4567, current_state: "scheduled" },
    });

    const result = await scheduleEmailCampaign({
      email_campaign_id: 4567,
      datetime: withOffset,
    });

    expect(mockClient.emailCampaigns.schedule).toHaveBeenCalledWith(4567, {
      datetime: withOffset,
    });
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await scheduleEmailCampaign({ email_campaign_id: 4567 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("datetime");
    expect(mockClient.emailCampaigns.schedule).not.toHaveBeenCalled();
  });

  it("rejects a datetime that is not ISO 8601", async () => {
    const result = await scheduleEmailCampaign({
      email_campaign_id: 4567,
      datetime: "tomorrow at noon",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("datetime");
    expect(mockClient.emailCampaigns.schedule).not.toHaveBeenCalled();
  });

  it("rejects a datetime in the past", async () => {
    const result = await scheduleEmailCampaign({
      email_campaign_id: 4567,
      datetime: isoDaysFromNow(-1),
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("must be in the future");
    expect(mockClient.emailCampaigns.schedule).not.toHaveBeenCalled();
  });

  it("rejects a datetime more than 1 month ahead", async () => {
    const result = await scheduleEmailCampaign({
      email_campaign_id: 4567,
      datetime: isoDaysFromNow(45),
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "must be no more than 1 month ahead"
    );
    expect(mockClient.emailCampaigns.schedule).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.schedule.mockRejectedValue(
      new Error("Cannot transition from 'started' to 'scheduled'")
    );

    const result = await scheduleEmailCampaign({
      email_campaign_id: 4567,
      datetime: isoDaysFromNow(7),
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to schedule email campaign: Cannot transition from 'started' to 'scheduled'"
    );
  });
});
