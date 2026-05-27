import deleteApiToken from "../deleteApiToken";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    apiTokens: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteApiToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("emits the SDK response when present", async () => {
    mockClient.general.apiTokens.delete.mockResolvedValue({
      id: 7,
      name: "CI",
    });

    const result = await deleteApiToken({ api_token_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("API tokens");
    expect(mockClient.general.apiTokens.delete).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.isError).toBeUndefined();
  });

  it("emits a confirmation when the SDK returns no body", async () => {
    mockClient.general.apiTokens.delete.mockResolvedValue(undefined);

    const result = await deleteApiToken({ api_token_id: 7 });

    expect(result.content[0].text).toContain('"api_token_id": 7');
    expect(result.content[0].text).toContain('"deleted": true');
  });

  it("surfaces API errors", async () => {
    mockClient.general.apiTokens.delete.mockRejectedValue(
      new Error("not found")
    );

    const result = await deleteApiToken({ api_token_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete API token: not found"
    );
  });
});
