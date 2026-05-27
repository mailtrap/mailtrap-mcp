import bulkUpdatePermissions from "../bulkUpdatePermissions";
import { requireClient } from "../../../client";

const mockClient = {
  general: {
    permissions: {
      bulkPermissionsUpdate: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("bulkUpdatePermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("forwards permissions to the SDK in the shape it expects", async () => {
    mockClient.general.permissions.bulkPermissionsUpdate.mockResolvedValue([
      { id: 1, name: "Project A", type: "project", access_level: 100 },
    ]);

    const result = await bulkUpdatePermissions({
      account_access_id: 42,
      permissions: [
        { resource_id: 100, resource_type: "project", access_level: 100 },
        {
          resource_id: "uuid-1",
          resource_type: "domain",
          destroy: true,
        },
      ],
    });

    expect(requireClient).toHaveBeenCalledWith("permissions");
    expect(
      mockClient.general.permissions.bulkPermissionsUpdate
    ).toHaveBeenCalledWith(42, [
      { resourceId: "100", resourceType: "project", accessLevel: "100" },
      { resourceId: "uuid-1", resourceType: "domain", destroy: "true" },
    ]);
    expect(result.content[0].text).toContain('"access_level": 100');
    expect(result.isError).toBeUndefined();
  });

  it("accepts string access_level values", async () => {
    mockClient.general.permissions.bulkPermissionsUpdate.mockResolvedValue([]);

    await bulkUpdatePermissions({
      account_access_id: 42,
      permissions: [
        { resource_id: 100, resource_type: "project", access_level: "viewer" },
      ],
    });

    expect(
      mockClient.general.permissions.bulkPermissionsUpdate
    ).toHaveBeenCalledWith(42, [
      { resourceId: "100", resourceType: "project", accessLevel: "viewer" },
    ]);
  });

  it("surfaces API errors", async () => {
    mockClient.general.permissions.bulkPermissionsUpdate.mockRejectedValue(
      new Error("invalid permission")
    );

    const result = await bulkUpdatePermissions({
      account_access_id: 42,
      permissions: [
        { resource_id: 1, resource_type: "project", access_level: 10 },
      ],
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to bulk update permissions: invalid permission"
    );
  });
});
