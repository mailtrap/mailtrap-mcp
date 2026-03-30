import createProject from "../createProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    projects: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("createProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should create a project successfully", async () => {
    const mockProject = { id: 1, name: "New Project" };
    mockClient.testing.projects.create.mockResolvedValue(mockProject);

    const result = await createProject({ name: "New Project" });

    expect(requireClient).toHaveBeenCalledWith("sandbox projects");
    expect(mockClient.testing.projects.create).toHaveBeenCalledWith(
      "New Project"
    );
    expect(result.content[0].text).toContain("created successfully");
    expect(result.content[0].text).toContain("New Project");
    expect(result.content[0].text).toContain("ID: 1");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox projects"
      );
    });

    const result = await createProject({ name: "Test" });

    expect(mockClient.testing.projects.create).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.projects.create.mockRejectedValue(
      new Error("Validation failed")
    );

    const result = await createProject({ name: "Bad" });

    expect(result.content[0].text).toContain(
      "Failed to create sandbox project"
    );
    expect(result.content[0].text).toContain("Validation failed");
    expect(result.isError).toBe(true);
  });
});
