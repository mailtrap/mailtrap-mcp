import createSubAccount from "../createSubAccount";
import { getOrganizationClient } from "../../../client";

const mockClient = {
  organizations: {
    subAccounts: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getOrganizationClient: jest.fn(() => mockClient),
}));

describe("createSubAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOrganizationClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a sub-account via the organization client and returns JSON", async () => {
    mockClient.organizations.subAccounts.create.mockResolvedValue({
      id: 99,
      name: "QA Sub",
    });

    const result = await createSubAccount({ name: "QA Sub" });

    expect(getOrganizationClient).toHaveBeenCalledWith();
    expect(mockClient.organizations.subAccounts.create).toHaveBeenCalledWith({
      name: "QA Sub",
    });
    expect(result.content[0].text).toContain('"id": 99');
    expect(result.content[0].text).toContain('"name": "QA Sub"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.organizations.subAccounts.create.mockRejectedValue(
      new Error("name taken")
    );

    const result = await createSubAccount({ name: "Dup" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create sub-account: name taken"
    );
  });
});
