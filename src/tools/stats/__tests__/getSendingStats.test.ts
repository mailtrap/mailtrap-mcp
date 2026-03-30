import getSendingStats from "../getSendingStats";
import { requireClient } from "../../../client";

const mockClient = {
  stats: {
    get: jest.fn(),
    byDomain: jest.fn(),
    byCategory: jest.fn(),
    byEmailServiceProvider: jest.fn(),
    byDate: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
}));

const mockStats = {
  delivery_count: 100,
  delivery_rate: 0.95,
  bounce_count: 5,
  bounce_rate: 0.05,
  open_count: 80,
  open_rate: 0.8,
  click_count: 50,
  click_rate: 0.5,
  spam_count: 2,
  spam_rate: 0.02,
};

const originalEnv = { ...process.env };

describe("getSendingStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, {
      MAILTRAP_ACCOUNT_ID: "12345",
    });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.stats.get.mockResolvedValue(mockStats);
    mockClient.stats.byDomain.mockResolvedValue([
      { name: "sending_domain_id", value: 3938, stats: mockStats },
    ]);
    mockClient.stats.byDate.mockResolvedValue([
      { name: "date", value: "2025-01-01", stats: mockStats },
    ]);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
    jest.resetModules();
  });

  it("should return aggregated stats successfully", async () => {
    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });

    expect(mockClient.stats.get).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("Sending stats (aggregated)");
    expect(result.content[0].text).toContain("2025-01-01 to 2025-01-31");
    expect(result.content[0].text).toContain("Delivery: 100 (95.00%)");
    expect(result.content[0].text).toContain("Bounces: 5 (5.00%)");
    expect(result.content[0].text).toContain("Opens: 80 (80.00%)");
    expect(result.content[0].text).toContain("Clicks: 50 (50.00%)");
    expect(result.content[0].text).toContain("Spam: 2 (2.00%)");
    expect(result.isError).toBeUndefined();
  });

  it("should return stats by domain when breakdown is by_domain", async () => {
    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
      breakdown: "by_domain",
    });

    expect(mockClient.stats.byDomain).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.content[0].text).toContain("by domain");
    expect(result.content[0].text).toContain("3938:");
    expect(result.content[0].text).toContain("Delivery: 100 (95.00%)");
    expect(result.isError).toBeUndefined();
  });

  it("should return stats by date when breakdown is by_date", async () => {
    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
      breakdown: "by_date",
    });

    expect(mockClient.stats.byDate).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.content[0].text).toContain("by date");
    expect(result.content[0].text).toContain("2025-01-01:");
    expect(result.isError).toBeUndefined();
  });

  it("should pass optional filters to the API", async () => {
    await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
      sending_domain_ids: [1, 2],
      sending_streams: ["transactional"],
      categories: ["Welcome"],
      email_service_providers: ["Google"],
    });

    expect(mockClient.stats.get).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
      sending_domain_ids: [1, 2],
      sending_streams: ["transactional"],
      categories: ["Welcome"],
      email_service_providers: ["Google"],
    });
  });

  it("should return error when MAILTRAP_ACCOUNT_ID is missing", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending stats"
      );
    });

    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "MAILTRAP_ACCOUNT_ID environment variable is required for sending stats"
    );
    expect(mockClient.stats.get).not.toHaveBeenCalled();
  });

  it("should return error when MAILTRAP_ACCOUNT_ID is invalid", async () => {
    process.env.MAILTRAP_ACCOUNT_ID = "not-a-number";
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending stats"
      );
    });

    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "MAILTRAP_ACCOUNT_ID environment variable is required for sending stats"
    );
  });

  it("should return error when requireClient throws", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    });
    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_API_TOKEN");
  });

  it("should handle API errors", async () => {
    mockClient.stats.get.mockRejectedValue(new Error("Rate limit exceeded"));

    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to get sending stats");
    expect(result.content[0].text).toContain("Rate limit exceeded");
  });

  it("should call byCategory when breakdown is by_category", async () => {
    mockClient.stats.byCategory.mockResolvedValue([
      { name: "category", value: "Welcome", stats: mockStats },
    ]);

    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
      breakdown: "by_category",
    });

    expect(mockClient.stats.byCategory).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.content[0].text).toContain("Welcome:");
  });

  it("should call byEmailServiceProvider when breakdown is by_email_service_provider", async () => {
    mockClient.stats.byEmailServiceProvider.mockResolvedValue([
      { name: "email_service_provider", value: "Google", stats: mockStats },
    ]);

    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
      breakdown: "by_email_service_provider",
    });

    expect(mockClient.stats.byEmailServiceProvider).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.content[0].text).toContain("Google:");
  });
});
