import createApiToken from "../createApiToken";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    apiTokens: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createApiToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a token with resources and surfaces the full response including the one-time token", async () => {
    mockClient.general.apiTokens.create.mockResolvedValue({
      id: 7,
      name: "CI",
      last_4_digits: "abcd",
      created_by: "user@example.com",
      expires_at: null,
      resources: [
        { resource_type: "project", resource_id: 1, access_level: 100 },
      ],
      token: "mt-token-secret",
    });

    const result = await createApiToken({
      name: "CI",
      resources: [
        { resource_type: "project", resource_id: 1, access_level: 100 },
      ],
    });

    expect(requireClient).toHaveBeenCalledWith("API tokens");
    expect(mockClient.general.apiTokens.create).toHaveBeenCalledWith({
      name: "CI",
      resources: [
        { resource_type: "project", resource_id: 1, access_level: 100 },
      ],
    });
    expect(result.content[0].text).toContain('"token": "mt-token-secret"');
    expect(result.isError).toBeUndefined();
  });

  it("works with just a name", async () => {
    mockClient.general.apiTokens.create.mockResolvedValue({
      id: 8,
      name: "Personal",
      token: "mt-token-personal",
    });

    await createApiToken({ name: "Personal" });

    expect(mockClient.general.apiTokens.create).toHaveBeenCalledWith({
      name: "Personal",
    });
  });

  it("surfaces API errors", async () => {
    mockClient.general.apiTokens.create.mockRejectedValue(
      new Error("name taken")
    );

    const result = await createApiToken({ name: "Dup" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create API token: name taken"
    );
  });
});
