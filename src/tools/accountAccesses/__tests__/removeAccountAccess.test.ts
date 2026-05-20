import removeAccountAccess from "../removeAccountAccess";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    accountAccesses: {
      removeAccountAccess: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("removeAccountAccess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("removes the access and returns the SDK response", async () => {
    mockClient.general.accountAccesses.removeAccountAccess.mockResolvedValue({
      id: 99,
    });

    const result = await removeAccountAccess({ account_access_id: 99 });

    expect(requireClient).toHaveBeenCalledWith("account accesses");
    expect(
      mockClient.general.accountAccesses.removeAccountAccess
    ).toHaveBeenCalledWith(99);
    expect(result.content[0].text).toContain('"id": 99');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.general.accountAccesses.removeAccountAccess.mockRejectedValue(
      new Error("forbidden")
    );

    const result = await removeAccountAccess({ account_access_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to remove account access: forbidden"
    );
  });
});
