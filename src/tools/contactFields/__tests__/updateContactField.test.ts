import updateContactField from "../updateContactField";
import { requireClient } from "../../../client";

const mockClient = {
  contactFields: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateContactField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("renames the field and returns the JSON response", async () => {
    mockClient.contactFields.update.mockResolvedValue({
      data: {
        id: 7,
        name: "Given Name",
        merge_tag: "given_name",
        data_type: "text",
        created_at: 1716100000,
        updated_at: 1716200000,
      },
    });

    const result = await updateContactField({
      field_id: 7,
      name: "Given Name",
      merge_tag: "given_name",
    });

    expect(requireClient).toHaveBeenCalledWith("contact fields");
    expect(mockClient.contactFields.update).toHaveBeenCalledWith(7, {
      name: "Given Name",
      merge_tag: "given_name",
    });
    expect(result.content[0].text).toContain('"name": "Given Name"');
    expect(result.isError).toBeUndefined();
  });

  it("passes only the fields the caller actually provided", async () => {
    mockClient.contactFields.update.mockResolvedValue({
      data: { id: 7, name: "Original" },
    });

    await updateContactField({ field_id: 7, data_type: "number" });

    expect(mockClient.contactFields.update).toHaveBeenCalledWith(7, {
      data_type: "number",
    });
  });

  it("handles a raw field response (no `data` wrapper)", async () => {
    mockClient.contactFields.update.mockResolvedValue({
      id: 7,
      name: "Given Name",
      merge_tag: "given_name",
      data_type: "text",
      created_at: 1716100000,
      updated_at: 1716200000,
    });

    const result = await updateContactField({
      field_id: 7,
      name: "Given Name",
    });

    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain('"name": "Given Name"');
    expect(result.isError).toBeUndefined();
  });

  it("returns an error when the API responds with an empty payload", async () => {
    mockClient.contactFields.update.mockResolvedValue(null);

    const result = await updateContactField({ field_id: 7, name: "x" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update contact field: empty response from contact fields API"
    );
  });

  it("surfaces API errors", async () => {
    mockClient.contactFields.update.mockRejectedValue(
      new Error("validation failed")
    );

    const result = await updateContactField({ field_id: 7, name: "x" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update contact field: validation failed"
    );
  });
});
