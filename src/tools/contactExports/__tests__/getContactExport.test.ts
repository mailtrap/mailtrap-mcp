import getContactExport from "../getContactExport";
import { requireClient } from "../../../client";

const mockClient = {
  contactExports: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getContactExport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the export job as JSON", async () => {
    mockClient.contactExports.get.mockResolvedValue({
      id: 42,
      status: "finished",
      created_at: "2026-05-20T10:00:00Z",
      updated_at: "2026-05-20T10:01:30Z",
      url: "https://example.com/exports/42.csv",
    });

    const result = await getContactExport({ export_id: 42 });

    expect(requireClient).toHaveBeenCalledWith("contact exports");
    expect(mockClient.contactExports.get).toHaveBeenCalledWith(42);
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"status": "finished"');
    expect(result.content[0].text).toContain(
      '"url": "https://example.com/exports/42.csv"'
    );
    expect(result.isError).toBeUndefined();
  });

  it("handles a started export with null url", async () => {
    mockClient.contactExports.get.mockResolvedValue({
      id: 42,
      status: "started",
      created_at: "2026-05-20T10:00:00Z",
      updated_at: "2026-05-20T10:00:00Z",
      url: null,
    });

    const result = await getContactExport({ export_id: 42 });

    expect(result.content[0].text).toContain('"url": null');
  });

  it("surfaces API errors", async () => {
    mockClient.contactExports.get.mockRejectedValue(new Error("not found"));

    const result = await getContactExport({ export_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get contact export: not found"
    );
  });
});
