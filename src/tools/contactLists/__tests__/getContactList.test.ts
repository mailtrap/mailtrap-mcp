import getContactList from "../getContactList";
import { requireClient } from "../../../client";

const mockClient = {
  contactLists: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getContactList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the list as JSON", async () => {
    mockClient.contactLists.get.mockResolvedValue({
      id: 7,
      name: "Newsletter",
    });

    const result = await getContactList({ list_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("contact lists");
    expect(mockClient.contactLists.get).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain('"name": "Newsletter"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactLists.get.mockRejectedValue(new Error("not found"));

    const result = await getContactList({ list_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get contact list: not found"
    );
  });
});
