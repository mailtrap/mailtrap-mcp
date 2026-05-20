import getContactField from "../getContactField";
import { requireClient } from "../../../client";

const mockClient = {
  contactFields: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getContactField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the field as JSON", async () => {
    mockClient.contactFields.get.mockResolvedValue({
      data: {
        id: 7,
        name: "First Name",
        merge_tag: "first_name",
        data_type: "text",
        created_at: 1716100000,
        updated_at: 1716100000,
      },
    });

    const result = await getContactField({ field_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("contact fields");
    expect(mockClient.contactFields.get).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain('"merge_tag": "first_name"');
    expect(result.isError).toBeUndefined();
  });

  it("handles a raw field response (no `data` wrapper)", async () => {
    mockClient.contactFields.get.mockResolvedValue({
      id: 7,
      name: "First Name",
      merge_tag: "first_name",
      data_type: "text",
      created_at: 1716100000,
      updated_at: 1716100000,
    });

    const result = await getContactField({ field_id: 7 });

    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain('"merge_tag": "first_name"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactFields.get.mockRejectedValue(new Error("not found"));

    const result = await getContactField({ field_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get contact field: not found"
    );
  });
});
