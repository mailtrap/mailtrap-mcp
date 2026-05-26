import deleteContact from "../deleteContact";
import { requireClient } from "../../../client";

const mockClient = {
  contacts: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteContact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("emits the deleted contact when the SDK returns it", async () => {
    mockClient.contacts.delete.mockResolvedValue({
      data: { id: "abc-1", email: "alice@example.com" },
    });

    const result = await deleteContact({ contact_identifier: "abc-1" });

    expect(requireClient).toHaveBeenCalledWith("contacts");
    expect(mockClient.contacts.delete).toHaveBeenCalledWith("abc-1");
    expect(result.content[0].text).toContain('"id": "abc-1"');
    expect(result.isError).toBeUndefined();
  });

  it("emits a confirmation object when the SDK returns no body", async () => {
    mockClient.contacts.delete.mockResolvedValue(undefined);

    const result = await deleteContact({
      contact_identifier: "alice@example.com",
    });

    expect(result.content[0].text).toContain(
      '"contact_identifier": "alice@example.com"'
    );
    expect(result.content[0].text).toContain('"deleted": true');
  });

  it("surfaces API errors", async () => {
    mockClient.contacts.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteContact({ contact_identifier: "missing" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to delete contact: not found");
  });
});
