import createSubAccount from "../createSubAccount";
import { requireClient } from "../../../client";

const mockClient = {
  organizations: {
    subAccounts: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createSubAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a sub-account and returns the result as JSON", async () => {
    mockClient.organizations.subAccounts.create.mockResolvedValue({
      id: 99,
      name: "QA Sub",
    });

    const result = await createSubAccount({ name: "QA Sub" });

    expect(requireClient).toHaveBeenCalledWith("sub-accounts", {
      requireAccountId: false,
      requireOrganizationId: true,
    });
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
