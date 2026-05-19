import listContactFields from "../listContactFields";
import { requireClient } from "../../../client";

const mockClient = {
  contactFields: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listContactFields", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the fields as JSON", async () => {
    mockClient.contactFields.getList.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "First Name",
          merge_tag: "first_name",
          data_type: "text",
          created_at: 1716100000,
          updated_at: 1716100000,
        },
        {
          id: 2,
          name: "Age",
          merge_tag: "age",
          data_type: "number",
          created_at: 1716100000,
          updated_at: 1716100000,
        },
      ],
    });

    const result = await listContactFields();

    expect(requireClient).toHaveBeenCalledWith("contact fields");
    expect(mockClient.contactFields.getList).toHaveBeenCalledWith();
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"merge_tag": "first_name"');
    expect(result.content[0].text).toContain('"data_type": "number"');
    expect(result.isError).toBeUndefined();
  });

  it("returns the empty message when no fields exist", async () => {
    mockClient.contactFields.getList.mockResolvedValue({ data: [] });

    const result = await listContactFields();

    expect(result.content[0].text).toBe(
      "No contact fields in your Mailtrap account."
    );
  });

  it("handles a response without data", async () => {
    mockClient.contactFields.getList.mockResolvedValue(undefined);

    const result = await listContactFields();

    expect(result.content[0].text).toBe(
      "No contact fields in your Mailtrap account."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.contactFields.getList.mockRejectedValue(new Error("boom"));

    const result = await listContactFields();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list contact fields: boom");
  });
});
