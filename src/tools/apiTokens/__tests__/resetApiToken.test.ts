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

  it("forwards expires_at for the new token when provided", async () => {
    mockClient.general.apiTokens.reset.mockResolvedValue({
      id: 7,
      name: "CI",
      expires_at: "2027-06-01T00:00:00Z",
      token: "mt-token-new",
    });

    await resetApiToken({
      api_token_id: 7,
      expires_at: "2027-06-01T00:00:00Z",
    });

    expect(mockClient.general.apiTokens.reset).toHaveBeenCalledWith(7, {
      expires_at: "2027-06-01T00:00:00Z",
    });
  });

  it("forwards an explicit null expires_at for a token that never expires", async () => {
    mockClient.general.apiTokens.reset.mockResolvedValue({
      id: 7,
      name: "CI",
      expires_at: null,
      token: "mt-token-new",
    });

    await resetApiToken({ api_token_id: 7, expires_at: null });

    expect(mockClient.general.apiTokens.reset).toHaveBeenCalledWith(7, {
      expires_at: null,
    });
  });

  it("surfaces server-side expiration validation errors", async () => {
    mockClient.general.apiTokens.reset.mockRejectedValue(
      new Error("expires_at: must not be in the past")
    );

    const result = await resetApiToken({
      api_token_id: 7,
      expires_at: "2020-01-01T00:00:00Z",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to reset API token: expires_at: must not be in the past"
    );
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
