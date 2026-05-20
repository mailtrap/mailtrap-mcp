import listApiTokens from "../listApiTokens";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    apiTokens: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listApiTokens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns tokens as JSON", async () => {
    mockClient.general.apiTokens.getList.mockResolvedValue([
      {
        id: 1,
        name: "CI",
        last_4_digits: "abcd",
        created_by: "user@example.com",
        expires_at: null,
        resources: [],
      },
    ]);

    const result = await listApiTokens();

    expect(requireClient).toHaveBeenCalledWith("API tokens");
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"name": "CI"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.general.apiTokens.getList.mockRejectedValue(
      new Error("forbidden")
    );

    const result = await listApiTokens();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list API tokens: forbidden");
  });
});
