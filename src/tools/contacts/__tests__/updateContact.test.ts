import updateContact from "../updateContact";
import { requireClient } from "../../../client";

const mockClient = {
  contacts: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateContact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates a contact and returns the JSON response", async () => {
    mockClient.contacts.update.mockResolvedValue({
      data: {
        id: "abc-1",
        email: "alice@example.com",
        list_ids: [10, 11],
        status: "subscribed",
        fields: { first_name: "Alice" },
      },
    });

    const result = await updateContact({
      contact_identifier: "abc-1",
      fields: { first_name: "Alice" },
      list_ids_included: [11],
    });

    expect(requireClient).toHaveBeenCalledWith("contacts");
    expect(mockClient.contacts.update).toHaveBeenCalledWith("abc-1", {
      fields: { first_name: "Alice" },
      list_ids_included: [11],
    });
    expect(result.content[0].text).toContain('"id": "abc-1"');
    expect(result.content[0].text).toContain('"first_name": "Alice"');
    expect(result.isError).toBeUndefined();
  });

  it("passes only the fields the caller actually provided", async () => {
    mockClient.contacts.update.mockResolvedValue({
      data: { id: "abc-1", email: "alice@example.com" },
    });

    await updateContact({
      contact_identifier: "alice@example.com",
      unsubscribed: true,
    });

    expect(mockClient.contacts.update).toHaveBeenCalledWith(
      "alice@example.com",
      { unsubscribed: true }
    );
  });

  it("surfaces API errors", async () => {
    mockClient.contacts.update.mockRejectedValue(new Error("not found"));

    const result = await updateContact({
      contact_identifier: "missing",
      unsubscribed: true,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to update contact: not found");
  });
});
