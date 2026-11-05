import listAccounts from "../listAccounts";
import { getAccountsClient } from "../../../client";

const mockClient = {
  general: {
    accounts: {
      getAllAccounts: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getAccountsClient: jest.fn(() => mockClient),
}));

describe("listAccounts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAccountsClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns accounts as JSON", async () => {
    mockClient.general.accounts.getAllAccounts.mockResolvedValue([
      { id: 1, name: "Personal", access_levels: [1000] },
      { id: 2, name: "Work", access_levels: [100] },
    ]);

    const result = await listAccounts();

    expect(getAccountsClient).toHaveBeenCalled();
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

  it("surfaces a missing API token", async () => {
    (getAccountsClient as jest.Mock).mockImplementation(() => {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    });

    const result = await listAccounts();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list accounts: MAILTRAP_API_TOKEN environment variable is required"
    );
  });
});
