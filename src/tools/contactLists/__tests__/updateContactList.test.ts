import updateContactList from "../updateContactList";
import { requireClient } from "../../../client";

const mockClient = {
  contactLists: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateContactList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("renames the list and returns the JSON response", async () => {
    mockClient.contactLists.update.mockResolvedValue({
      id: 7,
      name: "Renamed",
    });

    const result = await updateContactList({ list_id: 7, name: "Renamed" });

    expect(requireClient).toHaveBeenCalledWith("contact lists");
    expect(mockClient.contactLists.update).toHaveBeenCalledWith(7, {
      name: "Renamed",
    });
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain('"name": "Renamed"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactLists.update.mockRejectedValue(new Error("not found"));

    const result = await updateContactList({ list_id: 99, name: "x" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update contact list: not found"
    );
  });
});
