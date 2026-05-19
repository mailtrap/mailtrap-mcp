import createContactEvent from "../createContactEvent";
import { requireClient } from "../../../client";

const mockClient = {
  contactEvents: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createContactEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates the event and returns the response as JSON", async () => {
    mockClient.contactEvents.create.mockResolvedValue({
      contact_id: "abc-1",
      contact_email: "alice@example.com",
      name: "purchase",
      params: { order_id: 42, amount: 19.99 },
    });

    const result = await createContactEvent({
      contact_identifier: "abc-1",
      name: "purchase",
      params: { order_id: 42, amount: 19.99 },
    });

    expect(requireClient).toHaveBeenCalledWith("contacts");
    expect(mockClient.contactEvents.create).toHaveBeenCalledWith("abc-1", {
      name: "purchase",
      params: { order_id: 42, amount: 19.99 },
    });
    expect(result.content[0].text).toContain('"contact_id": "abc-1"');
    expect(result.content[0].text).toContain('"name": "purchase"');
    expect(result.content[0].text).toContain('"order_id": 42');
    expect(result.isError).toBeUndefined();
  });

  it("supports email identifiers and empty params", async () => {
    mockClient.contactEvents.create.mockResolvedValue({
      contact_id: "abc-2",
      contact_email: "bob@example.com",
      name: "signed_in",
      params: {},
    });

    await createContactEvent({
      contact_identifier: "bob@example.com",
      name: "signed_in",
      params: {},
    });

    expect(mockClient.contactEvents.create).toHaveBeenCalledWith(
      "bob@example.com",
      { name: "signed_in", params: {} }
    );
  });

  it("surfaces API errors", async () => {
    mockClient.contactEvents.create.mockRejectedValue(
      new Error("contact not found")
    );

    const result = await createContactEvent({
      contact_identifier: "missing",
      name: "purchase",
      params: {},
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact event: contact not found"
    );
  });
});
