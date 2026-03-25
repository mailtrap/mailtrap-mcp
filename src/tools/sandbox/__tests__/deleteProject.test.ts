import deleteProject from "../deleteProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    projects: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("deleteProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should delete a project successfully", async () => {
    const mockProject = { id: 1, name: "Old Project" };
    mockClient.testing.projects.delete.mockResolvedValue(mockProject);

    const result = await deleteProject({ project_id: 1 });

    expect(requireClient).toHaveBeenCalledWith("sandbox projects");
    expect(mockClient.testing.projects.delete).toHaveBeenCalledWith(1);
    expect(result.content[0].text).toContain("deleted successfully");
    expect(result.content[0].text).toContain("Old Project");
    expect(result.content[0].text).toContain("ID: 1");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox projects"
      );
    });

    const result = await deleteProject({ project_id: 1 });

    expect(mockClient.testing.projects.delete).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.projects.delete.mockRejectedValue(
      new Error("Not found")
    );

    const result = await deleteProject({ project_id: 999 });

    expect(result.content[0].text).toContain(
      "Failed to delete sandbox project"
    );
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
