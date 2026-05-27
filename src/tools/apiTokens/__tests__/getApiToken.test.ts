import getApiToken from "../getApiToken";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    apiTokens: {
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getApiToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the token record as JSON", async () => {
    mockClient.general.apiTokens.get.mockResolvedValue({
      id: 7,
      name: "CI",
      last_4_digits: "abcd",
      resources: [],
    });

    const result = await getApiToken({ api_token_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("API tokens");
    expect(mockClient.general.apiTokens.get).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.general.apiTokens.get.mockRejectedValue(new Error("not found"));

    const result = await getApiToken({ api_token_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get API token: not found");
  });
});
