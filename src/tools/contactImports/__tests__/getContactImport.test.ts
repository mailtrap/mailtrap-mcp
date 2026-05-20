import getContactImport from "../getContactImport";
import { requireClient } from "../../../client";

const mockClient = {
  contactImports: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getContactImport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the import job as JSON", async () => {
    mockClient.contactImports.get.mockResolvedValue({
      id: 42,
      status: "finished",
      created_contacts_count: 100,
      updated_contacts_count: 5,
      contacts_over_limit_count: 0,
    });

    const result = await getContactImport({ import_id: 42 });

    expect(requireClient).toHaveBeenCalledWith("contact imports");
    expect(mockClient.contactImports.get).toHaveBeenCalledWith(42);
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"status": "finished"');
    expect(result.content[0].text).toContain('"created_contacts_count": 100');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactImports.get.mockRejectedValue(new Error("not found"));

    const result = await getContactImport({ import_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get contact import: not found"
    );
  });
});
