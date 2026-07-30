import updateEmailCampaign from "../updateEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates the campaign and returns the unwrapped campaign", async () => {
    mockClient.emailCampaigns.update.mockResolvedValue({
      data: { id: 4567, name: "Spring Sale (updated)" },
    });

    const result = await updateEmailCampaign({
      email_campaign_id: 4567,
      name: "Spring Sale (updated)",
      template_attributes: {
        subject: "New subject",
        body_html: "<html><body>Hi</body></html>",
      },
    });

    expect(requireClient).toHaveBeenCalledWith("email campaigns");
    expect(mockClient.emailCampaigns.update).toHaveBeenCalledWith(4567, {
      name: "Spring Sale (updated)",
      template_attributes: {
        subject: "New subject",
        body_html: "<html><body>Hi</body></html>",
      },
    });
    expect(result.content[0].text).toContain('"name": "Spring Sale (updated)"');
    expect(result.isError).toBeUndefined();
  });

  it("accepts body_text: null to clear the text body", async () => {
    mockClient.emailCampaigns.update.mockResolvedValue({
      data: { id: 4567, name: "Spring Sale" },
    });

    const result = await updateEmailCampaign({
      email_campaign_id: 4567,
      template_attributes: { body_text: null },
    });

    expect(mockClient.emailCampaigns.update).toHaveBeenCalledWith(4567, {
      template_attributes: { body_text: null },
    });
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await updateEmailCampaign({ name: "Missing ID" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("email_campaign_id");
    expect(mockClient.emailCampaigns.update).not.toHaveBeenCalled();
  });

  it("rejects an update with no fields to change", async () => {
    const result = await updateEmailCampaign({ email_campaign_id: 4567 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Provide at least one field to update."
    );
    expect(mockClient.emailCampaigns.update).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.update.mockRejectedValue(
      new Error("Campaign is not draft")
    );

    const result = await updateEmailCampaign({
      email_campaign_id: 4567,
      name: "x",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update email campaign: Campaign is not draft"
    );
  });
});
