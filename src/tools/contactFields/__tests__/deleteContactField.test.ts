import deleteContactField from "../deleteContactField";
import { requireClient } from "../../../client";

const mockClient = {
  contactFields: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteContactField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the field and returns a confirmation payload", async () => {
    mockClient.contactFields.delete.mockResolvedValue(undefined);

    const result = await deleteContactField({ field_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("contact fields");
    expect(mockClient.contactFields.delete).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"field_id": 7');
    expect(result.content[0].text).toContain('"deleted": true');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactFields.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteContactField({ field_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete contact field: not found"
    );
  });
});
