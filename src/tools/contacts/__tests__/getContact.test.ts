import getContact from "../getContact";
import { requireClient } from "../../../client";

const mockClient = {
  contacts: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getContact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the contact as JSON when fetched by id", async () => {
    mockClient.contacts.get.mockResolvedValue({
      data: {
        id: "abc-1",
        email: "alice@example.com",
        created_at: 1716100000,
        updated_at: 1716200000,
        list_ids: [1, 2],
        status: "subscribed",
        fields: { first_name: "Alice" },
      },
    });

    const result = await getContact({ contact_identifier: "abc-1" });

    expect(requireClient).toHaveBeenCalledWith("contacts");
    expect(mockClient.contacts.get).toHaveBeenCalledWith("abc-1");
    expect(result.content[0].text).toContain('"id": "abc-1"');
    expect(result.content[0].text).toContain('"email": "alice@example.com"');
    expect(result.isError).toBeUndefined();
  });

  it("passes the identifier through even when it is an email", async () => {
    mockClient.contacts.get.mockResolvedValue({
      data: { id: "abc-2", email: "bob@example.com" },
    });

    await getContact({ contact_identifier: "bob@example.com" });

    expect(mockClient.contacts.get).toHaveBeenCalledWith("bob@example.com");
  });

  it("surfaces API errors", async () => {
    mockClient.contacts.get.mockRejectedValue(new Error("not found"));

    const result = await getContact({ contact_identifier: "missing" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get contact: not found");
  });
});
