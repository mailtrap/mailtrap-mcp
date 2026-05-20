import listAccountAccesses from "../listAccountAccesses";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    accountAccesses: {
      listAccountAccesses: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listAccountAccesses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("calls the SDK without filters when none provided", async () => {
    mockClient.general.accountAccesses.listAccountAccesses.mockResolvedValue([
      { id: 1, name: "alice@example.com" },
    ]);

    const result = await listAccountAccesses();

    expect(requireClient).toHaveBeenCalledWith("account accesses");
    expect(
      mockClient.general.accountAccesses.listAccountAccesses
    ).toHaveBeenCalledWith(undefined);
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.isError).toBeUndefined();
  });

  it("translates snake_case filters to SDK camelCase", async () => {
    mockClient.general.accountAccesses.listAccountAccesses.mockResolvedValue(
      []
    );

    await listAccountAccesses({
      domain_uuids: ["d-1"],
      inbox_ids: ["i-2"],
      project_ids: ["p-3"],
    });

    expect(
      mockClient.general.accountAccesses.listAccountAccesses
    ).toHaveBeenCalledWith({
      domainUuids: ["d-1"],
      inboxIds: ["i-2"],
      projectIds: ["p-3"],
    });
  });

  it("surfaces API errors", async () => {
    mockClient.general.accountAccesses.listAccountAccesses.mockRejectedValue(
      new Error("forbidden")
    );

    const result = await listAccountAccesses();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list account accesses: forbidden"
    );
  });
});
