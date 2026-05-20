import listSubAccounts from "../listSubAccounts";
import { requireClient } from "../../../client";

const mockClient = {
  organizations: {
    subAccounts: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listSubAccounts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("requires the organization ID and returns sub-accounts as JSON", async () => {
    mockClient.organizations.subAccounts.getList.mockResolvedValue([
      { id: 1, name: "Sub A" },
      { id: 2, name: "Sub B" },
    ]);

    const result = await listSubAccounts();

    expect(requireClient).toHaveBeenCalledWith("sub-accounts", {
      requireAccountId: false,
      requireOrganizationId: true,
    });
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"name": "Sub B"');
    expect(result.isError).toBeUndefined();
  });

  it("returns empty message when no sub-accounts exist", async () => {
    mockClient.organizations.subAccounts.getList.mockResolvedValue([]);

    const result = await listSubAccounts();

    expect(result.content[0].text).toBe(
      "No sub-accounts in this organization."
    );
  });

  it("handles null response", async () => {
    mockClient.organizations.subAccounts.getList.mockResolvedValue(null);

    const result = await listSubAccounts();

    expect(result.content[0].text).toBe(
      "No sub-accounts in this organization."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.organizations.subAccounts.getList.mockRejectedValue(
      new Error("forbidden")
    );

    const result = await listSubAccounts();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list sub-accounts: forbidden"
    );
  });
});
