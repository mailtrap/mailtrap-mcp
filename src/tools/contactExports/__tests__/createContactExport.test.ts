import createContactExport from "../createContactExport";
import { requireClient } from "../../../client";

const mockClient = {
  contactExports: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createContactExport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("submits the export and returns the response as JSON", async () => {
    mockClient.contactExports.create.mockResolvedValue({
      id: 42,
      status: "started",
      created_at: "2026-05-20T10:00:00Z",
      updated_at: "2026-05-20T10:00:00Z",
      url: null,
    });

    const result = await createContactExport({
      filters: [{ name: "list_id", operator: "equal", value: 10 }],
    });

    expect(requireClient).toHaveBeenCalledWith("contact exports");
    expect(mockClient.contactExports.create).toHaveBeenCalledWith({
      filters: [{ name: "list_id", operator: "equal", value: 10 }],
    });
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"status": "started"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactExports.create.mockRejectedValue(
      new Error("invalid filter")
    );

    const result = await createContactExport({
      filters: [{ name: "bad", operator: "equal", value: "x" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact export: invalid filter"
    );
  });
});
