import createContactField from "../createContactField";
import { requireClient } from "../../../client";

const mockClient = {
  contactFields: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createContactField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a field and returns the result as JSON", async () => {
    mockClient.contactFields.create.mockResolvedValue({
      data: {
        id: 42,
        name: "First Name",
        merge_tag: "first_name",
        data_type: "text",
        created_at: 1716100000,
        updated_at: 1716100000,
      },
    });

    const result = await createContactField({
      name: "First Name",
      merge_tag: "first_name",
      data_type: "text",
    });

    expect(requireClient).toHaveBeenCalledWith("contact fields");
    expect(mockClient.contactFields.create).toHaveBeenCalledWith({
      name: "First Name",
      merge_tag: "first_name",
      data_type: "text",
    });
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"merge_tag": "first_name"');
    expect(result.isError).toBeUndefined();
  });

  it("handles a raw field response (no `data` wrapper)", async () => {
    mockClient.contactFields.create.mockResolvedValue({
      id: 42,
      name: "First Name",
      merge_tag: "first_name",
      data_type: "text",
      created_at: 1716100000,
      updated_at: 1716100000,
    });

    const result = await createContactField({
      name: "First Name",
      merge_tag: "first_name",
      data_type: "text",
    });

    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"merge_tag": "first_name"');
    expect(result.isError).toBeUndefined();
  });

  it("returns an error when the API responds with an empty payload", async () => {
    mockClient.contactFields.create.mockResolvedValue(null);

    const result = await createContactField({
      name: "First Name",
      merge_tag: "first_name",
      data_type: "text",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact field: empty response from contact fields API"
    );
  });

  it("surfaces API errors", async () => {
    mockClient.contactFields.create.mockRejectedValue(
      new Error("merge_tag is already in use")
    );

    const result = await createContactField({
      name: "Duplicate",
      merge_tag: "first_name",
      data_type: "text",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact field: merge_tag is already in use"
    );
  });
});
