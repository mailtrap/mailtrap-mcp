import resetApiToken from "../resetApiToken";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    apiTokens: {
      reset: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("resetApiToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("resets the token and surfaces the new secret value", async () => {
    mockClient.general.apiTokens.reset.mockResolvedValue({
      id: 7,
      name: "CI",
      token: "mt-token-new",
    });

    const result = await resetApiToken({ api_token_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("API tokens");
    expect(mockClient.general.apiTokens.reset).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"token": "mt-token-new"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.general.apiTokens.reset.mockRejectedValue(
      new Error("not found")
    );

    const result = await resetApiToken({ api_token_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to reset API token: not found");
  });
});
