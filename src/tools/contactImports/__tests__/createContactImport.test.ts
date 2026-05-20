import createContactImport from "../createContactImport";
import { requireClient } from "../../../client";

const mockClient = {
  contactImports: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createContactImport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("submits the import and returns the response as JSON", async () => {
    mockClient.contactImports.create.mockResolvedValue({
      id: 42,
      status: "created",
    });

    const result = await createContactImport({
      contacts: [
        {
          email: "alice@example.com",
          fields: { first_name: "Alice" },
          list_ids_included: [10],
        },
        { email: "bob@example.com" },
      ],
    });

    expect(requireClient).toHaveBeenCalledWith("contact imports");
    expect(mockClient.contactImports.create).toHaveBeenCalledWith({
      contacts: [
        {
          email: "alice@example.com",
          fields: { first_name: "Alice" },
          list_ids_included: [10],
        },
        { email: "bob@example.com" },
      ],
    });
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"status": "created"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.contactImports.create.mockRejectedValue(
      new Error("over plan limit")
    );

    const result = await createContactImport({
      contacts: [{ email: "x@y.com" }],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create contact import: over plan limit"
    );
  });
});
