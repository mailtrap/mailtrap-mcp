import listEmailCampaigns from "../listEmailCampaigns";
import { requireClient } from "../../../client";

const mockClient = {
  emailCampaigns: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listEmailCampaigns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the campaigns with pagination as JSON", async () => {
    mockClient.emailCampaigns.getList.mockResolvedValue({
      data: [
        { id: 4567, name: "Spring Sale", current_state: "draft" },
        { id: 4568, name: "Summer Sale", current_state: "scheduled" },
      ],
      pagination: { token: 1, next_token: 2 },
    });

    const result = await listEmailCampaigns({});

    expect(requireClient).toHaveBeenCalledWith("email campaigns", {
      requireAccountId: false,
    });
    expect(mockClient.emailCampaigns.getList).toHaveBeenCalledWith(undefined);
    expect(result.content[0].text).toContain('"id": 4567');
    expect(result.content[0].text).toContain('"name": "Spring Sale"');
    expect(result.content[0].text).toContain('"next_token": 2');
    expect(result.isError).toBeUndefined();
  });

  it("passes pagination and search params to the client", async () => {
    mockClient.emailCampaigns.getList.mockResolvedValue({
      data: [{ id: 4567, name: "Spring Sale" }],
      pagination: { token: 2 },
    });

    const result = await listEmailCampaigns({
      token: 2,
      per_page: 10,
      search: "spring",
    });

    expect(mockClient.emailCampaigns.getList).toHaveBeenCalledWith({
      token: 2,
      per_page: 10,
      search: "spring",
    });
    expect(result.content[0].text).toContain('"name": "Spring Sale"');
    expect(result.isError).toBeUndefined();
  });

  it("calls the client without options when no params are given", async () => {
    mockClient.emailCampaigns.getList.mockResolvedValue({ data: [] });

    await listEmailCampaigns(undefined);

    expect(mockClient.emailCampaigns.getList).toHaveBeenCalledWith(undefined);
  });

  it("rejects invalid input", async () => {
    const result = await listEmailCampaigns({ per_page: 500 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.emailCampaigns.getList).not.toHaveBeenCalled();
  });

  it("returns the empty message when no campaigns exist", async () => {
    mockClient.emailCampaigns.getList.mockResolvedValue({
      data: [],
      pagination: { token: 1 },
    });

    const result = await listEmailCampaigns({});

    expect(result.content[0].text).toBe(
      "No email campaigns in your Mailtrap account."
    );
  });

  it("handles a null response", async () => {
    mockClient.emailCampaigns.getList.mockResolvedValue(null);

    const result = await listEmailCampaigns({});

    expect(result.content[0].text).toBe(
      "No email campaigns in your Mailtrap account."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.emailCampaigns.getList.mockRejectedValue(new Error("boom"));

    const result = await listEmailCampaigns({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list email campaigns: boom");
  });
});
