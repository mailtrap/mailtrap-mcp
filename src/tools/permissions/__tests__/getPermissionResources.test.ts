import getPermissionResources from "../getPermissionResources";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    permissions: {
      getResources: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getPermissionResources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns resources as JSON", async () => {
    mockClient.general.permissions.getResources.mockResolvedValue([
      {
        id: 1,
        name: "Account",
        type: "account",
        access_level: 100,
        resources: [
          {
            id: 2,
            name: "Test Project",
            type: "project",
            access_level: 100,
            resources: [],
          },
        ],
      },
    ]);

    const result = await getPermissionResources();

    expect(requireClient).toHaveBeenCalledWith("permissions");
    expect(result.content[0].text).toContain('"name": "Account"');
    expect(result.content[0].text).toContain('"type": "project"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.general.permissions.getResources.mockRejectedValue(
      new Error("forbidden")
    );

    const result = await getPermissionResources();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get permission resources: forbidden"
    );
  });
});
