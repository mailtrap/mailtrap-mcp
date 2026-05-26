import createContactList from "../createContactList";
import { requireClient } from "../../../client";

const mockClient = {
  contactLists: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createContactList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a contact list and returns the result as JSON", async () => {
    mockClient.contactLists.create.mockResolvedValue({
      id: 99,
      name: "VIP",
    });

    const result = await createContactList({ name: "VIP" });

    expect(requireClient).toHaveBeenCalledWith("contact lists");
    expect(mockClient.contactLists.create).toHaveBeenCalledWith({
      name: "VIP",
    });
    expect(result.content[0].text).toContain('"id": 99');
    expect(result.content[0].text).toContain('"name": "VIP"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactLists.create.mockRejectedValue(
      new Error("name already exists")
    );

    const result = await createContactList({ name: "Duplicate" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact list: name already exists"
    );
  });
});
