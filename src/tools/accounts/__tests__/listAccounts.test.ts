import listAccounts from "../listAccounts";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    accounts: {
      getAllAccounts: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listAccounts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns accounts as JSON", async () => {
    mockClient.general.accounts.getAllAccounts.mockResolvedValue([
      { id: 1, name: "Personal", access_levels: [1000] },
      { id: 2, name: "Work", access_levels: [100] },
    ]);

    const result = await listAccounts();

    expect(requireClient).toHaveBeenCalledWith("accounts", {
      requireAccountId: false,
    });
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"name": "Work"');
    expect(result.isError).toBeUndefined();
  });

  it("returns empty message when no accounts", async () => {
    mockClient.general.accounts.getAllAccounts.mockResolvedValue([]);

    const result = await listAccounts();

    expect(result.content[0].text).toBe(
      "No Mailtrap accounts accessible to this API token."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.general.accounts.getAllAccounts.mockRejectedValue(
      new Error("boom")
    );

    const result = await listAccounts();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list accounts: boom");
  });
});
