import createEmailCampaign from "../createEmailCampaign";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const validParams = {
  name: "Spring Sale",
  domain_id: 4321,
  from_local_part: "news",
  template_attributes: { subject: "Spring is here — 30% off" },
};

describe("createEmailCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a campaign with a flat body and returns the unwrapped campaign", async () => {
    mockClient.emailCampaigns.create.mockResolvedValue({
      data: { id: 4567, name: "Spring Sale", current_state: "draft" },
    });

    const result = await createEmailCampaign(validParams);

    expect(requireClient).toHaveBeenCalledWith("email campaigns");
    expect(mockClient.emailCampaigns.create).toHaveBeenCalledWith(validParams);
    expect(result.content[0].text).toContain('"id": 4567');
    expect(result.content[0].text).toContain('"current_state": "draft"');
    expect(result.isError).toBeUndefined();
  });

  it("passes optional audience and delivery fields through", async () => {
    mockClient.emailCampaigns.create.mockResolvedValue({
      data: { id: 4568, name: "Spring Sale" },
    });

    const params = {
      ...validParams,
      from_display_name: "Acme Marketing",
      reply_to: {
        display_name: "Acme Support",
        local_part: "support",
        domain: "acme.com",
      },
      delivery_mode: "gradual",
      delivery_options: { emails_per_hour: 1000 },
      contact_list_ids: [55, 56],
      contact_segment_ids: [12],
    };

    const result = await createEmailCampaign(params);

    expect(mockClient.emailCampaigns.create).toHaveBeenCalledWith(params);
    expect(result.isError).toBeUndefined();
  });

  it("rejects input without a template subject", async () => {
    const result = await createEmailCampaign({
      ...validParams,
      template_attributes: {},
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("template_attributes.subject");
    expect(mockClient.emailCampaigns.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.create.mockRejectedValue(
      new Error("name can't be blank")
    );

    const result = await createEmailCampaign(validParams);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create email campaign: name can't be blank"
    );
  });
});
