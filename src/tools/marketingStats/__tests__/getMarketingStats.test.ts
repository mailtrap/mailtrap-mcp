import getMarketingStats from "../getMarketingStats";
import { requireClient } from "../../../client";

const mockClient = {
  marketingStats: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const stats = {
  delivery_count: 1450,
  delivery_rate: 0.9667,
  bounce_count: 30,
  bounce_rate: 0.02,
  open_count: 820,
  open_rate: 0.5655,
  click_count: 310,
  click_rate: 0.2138,
  spam_count: 5,
  spam_rate: 0.0033,
  unsubscription_count: 12,
  unsubscription_rate: 0.0083,
  sent_count: 1500,
};

describe("getMarketingStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("unwraps the data envelope and returns the stats as JSON", async () => {
    mockClient.marketingStats.get.mockResolvedValue({ data: stats });

    const result = await getMarketingStats({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
    });

    expect(requireClient).toHaveBeenCalledWith("marketing stats", {
      requireAccountId: false,
    });
    expect(mockClient.marketingStats.get).toHaveBeenCalledWith({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
    });
    expect(JSON.parse(result.content[0].text)).toEqual(stats);
    expect(result.isError).toBeUndefined();
  });

  it("passes the filters through to the client", async () => {
    mockClient.marketingStats.get.mockResolvedValue({ data: stats });

    await getMarketingStats({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
      sending_domain_ids: [3938, 3939],
      sources: ["campaigns"],
      email_service_providers: ["Google", "Yahoo"],
    });

    expect(mockClient.marketingStats.get).toHaveBeenCalledWith({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
      sending_domain_ids: [3938, 3939],
      sources: ["campaigns"],
      email_service_providers: ["Google", "Yahoo"],
    });
  });

  it("requires the date range", async () => {
    const result = await getMarketingStats({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(result.content[0].text).toContain("start_date");
    expect(result.content[0].text).toContain("end_date");
    expect(mockClient.marketingStats.get).not.toHaveBeenCalled();
  });

  it("rejects impossible dates and dates not in YYYY-MM-DD format", async () => {
    const result = await getMarketingStats({
      start_date: "2026-02-30",
      end_date: "2026-09-30T00:00:00Z",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "start_date: must be a valid date in YYYY-MM-DD format"
    );
    expect(result.content[0].text).toContain(
      "end_date: must be a valid date in YYYY-MM-DD format"
    );
    expect(mockClient.marketingStats.get).not.toHaveBeenCalled();
  });

  it("rejects an end_date before the start_date", async () => {
    const result = await getMarketingStats({
      start_date: "2026-09-30",
      end_date: "2026-09-01",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "end_date: must not be before start_date"
    );
    expect(mockClient.marketingStats.get).not.toHaveBeenCalled();
  });

  it("accepts a single-day range", async () => {
    mockClient.marketingStats.get.mockResolvedValue({ data: stats });

    const result = await getMarketingStats({
      start_date: "2026-02-28",
      end_date: "2026-02-28",
    });

    expect(result.isError).toBeUndefined();
  });

  it("rejects an unknown source", async () => {
    const result = await getMarketingStats({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
      sources: ["newsletters"],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("sources.0");
    expect(mockClient.marketingStats.get).not.toHaveBeenCalled();
  });

  it("rejects unknown parameters", async () => {
    const result = await getMarketingStats({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
      sending_streams: ["bulk"],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("sending_streams");
    expect(mockClient.marketingStats.get).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.marketingStats.get.mockRejectedValue(
      new Error("Access forbidden")
    );

    const result = await getMarketingStats({
      start_date: "2026-09-01",
      end_date: "2026-09-30",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get marketing stats: Access forbidden"
    );
  });
});
