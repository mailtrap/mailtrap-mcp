import deleteContactList from "../deleteContactList";
import { requireClient } from "../../../client";

const mockClient = {
  contactLists: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteContactList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the list and returns a confirmation payload", async () => {
    mockClient.contactLists.delete.mockResolvedValue(undefined);

    const result = await deleteContactList({ list_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("contact lists");
    expect(mockClient.contactLists.delete).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"list_id": 7');
    expect(result.content[0].text).toContain('"deleted": true');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactLists.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteContactList({ list_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete contact list: not found"
    );
  });
});
