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

  it("should return aggregated stats as JSON", async () => {
    const result = await getSendingStats({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });

    expect(mockClient.stats.get).toHaveBeenCalledWith({
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    });
    expect(result.content[0].text).toContain('"delivery_count": 100');
    expect(result.content[0].text).toContain('"delivery_rate": 0.95');
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
    expect(result.content[0].text).toContain('"value": 3938');
    expect(result.content[0].text).toContain('"delivery_count": 100');
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
    expect(result.content[0].text).toContain('"value": "2025-01-01"');
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
    expect(result.content[0].text).toContain('"value": "Welcome"');
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
    expect(result.content[0].text).toContain('"value": "Google"');
  });

  it("should return validation error for missing dates", async () => {
    const result = await getSendingStats({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Failed to get sending stats: Invalid input"
    );
  });
});
