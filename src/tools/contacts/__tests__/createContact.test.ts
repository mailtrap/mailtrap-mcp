import createContact from "../createContact";
import { requireClient } from "../../../client";

const mockClient = {
  contacts: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createContact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a contact with all fields and returns the result as JSON", async () => {
    mockClient.contacts.create.mockResolvedValue({
      data: {
        id: "new-1",
        email: "alice@example.com",
        created_at: 1716100000,
        updated_at: 1716100000,
        list_ids: [10, 20],
        status: "subscribed",
        fields: { first_name: "Alice", age: 30 },
      },
    });

    const result = await createContact({
      email: "alice@example.com",
      fields: { first_name: "Alice", age: 30 },
      list_ids: [10, 20],
    });

    expect(requireClient).toHaveBeenCalledWith("contacts");
    expect(mockClient.contacts.create).toHaveBeenCalledWith({
      email: "alice@example.com",
      fields: { first_name: "Alice", age: 30 },
      list_ids: [10, 20],
    });
    expect(result.content[0].text).toContain('"id": "new-1"');
    expect(result.content[0].text).toContain('"first_name": "Alice"');
    expect(result.isError).toBeUndefined();
  });

  it("passes through only the email when optionals are omitted", async () => {
    mockClient.contacts.create.mockResolvedValue({
      data: {
        id: "new-2",
        email: "bob@example.com",
        list_ids: [],
        status: "subscribed",
        fields: {},
      },
    });

    await createContact({ email: "bob@example.com" });

    expect(mockClient.contacts.create).toHaveBeenCalledWith({
      email: "bob@example.com",
    });
  });

  it("surfaces API errors", async () => {
    mockClient.contacts.create.mockRejectedValue(
      new Error("email already exists")
    );

    const result = await createContact({ email: "alice@example.com" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact: email already exists"
    );
  });
});
