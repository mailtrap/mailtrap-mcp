import listTrackingOptOuts from "../listTrackingOptOuts";
import { requireClient } from "../../../client";

const mockClient = {
  trackingOptOuts: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listTrackingOptOuts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("lists tracking opt-outs without filters", async () => {
    mockClient.trackingOptOuts.getList.mockResolvedValue({
      data: [
        {
          id: "abc-1",
          email: "alice@example.com",
          domain_name: "example.com",
          created_at: "2026-05-19T10:00:00Z",
        },
      ],
      last_id: null,
    });

    const result = await listTrackingOptOuts();

    expect(requireClient).toHaveBeenCalledWith("tracking opt-outs", {
      requireAccountId: false,
    });
    expect(mockClient.trackingOptOuts.getList).toHaveBeenCalledWith({});
    expect(result.content[0].text).toContain("Tracking opt-outs (1):");
    expect(result.content[0].text).toContain("alice@example.com");
    expect(result.content[0].text).not.toContain("More results available");
    expect(result.isError).toBeUndefined();
  });

  it("forwards every filter and surfaces the pagination cursor", async () => {
    mockClient.trackingOptOuts.getList.mockResolvedValue({
      data: [{ id: "abc-2", email: "bob@example.com", domain_name: null }],
      last_id: "abc-2",
    });

    const result = await listTrackingOptOuts({
      email: "bob@example.com",
      start_time: "2026-08-01T00:00:00Z",
      end_time: "2026-08-31T23:59:59Z",
      last_id: "abc-1",
    });

    expect(mockClient.trackingOptOuts.getList).toHaveBeenCalledWith({
      email: "bob@example.com",
      start_time: "2026-08-01T00:00:00Z",
      end_time: "2026-08-31T23:59:59Z",
      last_id: "abc-1",
    });
    expect(result.content[0].text).toContain('last_id: "abc-2"');
  });

  it("reports an empty list", async () => {
    mockClient.trackingOptOuts.getList.mockResolvedValue({
      data: [],
      last_id: null,
    });

    const result = await listTrackingOptOuts();

    expect(result.content[0].text).toBe(
      "No tracking opt-outs in your Mailtrap account."
    );
  });

  it("reports an empty filtered list", async () => {
    mockClient.trackingOptOuts.getList.mockResolvedValue({
      data: [],
      last_id: null,
    });

    const result = await listTrackingOptOuts({ email: "nobody@example.com" });

    expect(result.content[0].text).toBe(
      'No tracking opt-outs found matching email "nobody@example.com".'
    );
  });

  it("surfaces API errors", async () => {
    mockClient.trackingOptOuts.getList.mockRejectedValue(
      new Error("unauthorized")
    );

    const result = await listTrackingOptOuts();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list tracking opt-outs: unauthorized"
    );
  });
});
