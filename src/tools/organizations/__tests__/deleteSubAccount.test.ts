import deleteSubAccount from "../deleteSubAccount";
import { getOrganizationClient } from "../../../client";

const mockClient = {
  organizations: {
    subAccounts: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getOrganizationClient: jest.fn(() => mockClient),
}));

describe("deleteSubAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOrganizationClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the sub-account via the organization client and confirms deletion", async () => {
    mockClient.organizations.subAccounts.delete.mockResolvedValue(undefined);

    const result = await deleteSubAccount({ sub_account_id: 99 });

    expect(getOrganizationClient).toHaveBeenCalledWith();
    expect(mockClient.organizations.subAccounts.delete).toHaveBeenCalledWith(
      99
    );
    expect(result.content[0].text).toContain('"sub_account_id": 99');
    expect(result.content[0].text).toContain('"deleted": true');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input before calling the SDK", async () => {
    const result = await deleteSubAccount({ sub_account_id: "abc" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Failed to delete sub-account: Invalid input:"
    );
    expect(result.content[0].text).toContain("sub_account_id");
    expect(mockClient.organizations.subAccounts.delete).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.organizations.subAccounts.delete.mockRejectedValue(
      new Error("Not Found")
    );

    const result = await deleteSubAccount({ sub_account_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete sub-account: Not Found"
    );
  });
});
