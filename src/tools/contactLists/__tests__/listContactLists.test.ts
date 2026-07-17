import listContactLists from "../listContactLists";
import { requireClient } from "../../../client";

const mockClient = {
  contactLists: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listContactLists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the lists as JSON", async () => {
    mockClient.contactLists.getList.mockResolvedValue([
      { id: 1, name: "Newsletter" },
      { id: 2, name: "Onboarding" },
    ]);

    const result = await listContactLists({});

    expect(requireClient).toHaveBeenCalledWith("contact lists");
    expect(mockClient.contactLists.getList).toHaveBeenCalledWith(undefined);
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"name": "Newsletter"');
    expect(result.isError).toBeUndefined();
  });

  it("passes the search filter to the client when provided", async () => {
    mockClient.contactLists.getList.mockResolvedValue([
      { id: 1, name: "Newsletter" },
    ]);

    const result = await listContactLists({ search: "news" });

    expect(mockClient.contactLists.getList).toHaveBeenCalledWith({
      search: "news",
    });
    expect(result.content[0].text).toContain('"name": "Newsletter"');
    expect(result.isError).toBeUndefined();
  });

  it("calls the client without options when search is omitted", async () => {
    mockClient.contactLists.getList.mockResolvedValue([]);

    await listContactLists(undefined);

    expect(mockClient.contactLists.getList).toHaveBeenCalledWith(undefined);
  });

  it("rejects invalid input", async () => {
    const result = await listContactLists({ search: 123 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.contactLists.getList).not.toHaveBeenCalled();
  });

  it("returns the empty message when no lists exist", async () => {
    mockClient.contactLists.getList.mockResolvedValue([]);

    const result = await listContactLists({});

    expect(result.content[0].text).toBe(
      "No contact lists in your Mailtrap account."
    );
  });

  it("handles a null response", async () => {
    mockClient.contactLists.getList.mockResolvedValue(null);

    const result = await listContactLists({});

    expect(result.content[0].text).toBe(
      "No contact lists in your Mailtrap account."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.contactLists.getList.mockRejectedValue(new Error("boom"));

    const result = await listContactLists({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list contact lists: boom");
  });
});
