import listProjects from "../listProjects";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    projects: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("listProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should list projects with their inboxes", async () => {
    const mockProjects = [
      {
        id: 1,
        name: "My Project",
        inboxes: [
          { id: 10, name: "Inbox 1", emails_count: 5 },
          { id: 11, name: "Inbox 2", emails_count: 0 },
        ],
      },
      {
        id: 2,
        name: "Other Project",
        inboxes: [],
      },
    ];
    mockClient.testing.projects.getList.mockResolvedValue(mockProjects);

    const result = await listProjects();

    expect(requireClient).toHaveBeenCalledWith("sandbox projects");
    expect(mockClient.testing.projects.getList).toHaveBeenCalledWith();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("Sandbox projects (2)");
    expect(result.content[0].text).toContain("My Project");
    expect(result.content[0].text).toContain("ID: 1");
    expect(result.content[0].text).toContain("Inbox 1");
    expect(result.content[0].text).toContain("emails: 5");
    expect(result.content[0].text).toContain("(no inboxes)");
    expect(result.isError).toBeUndefined();
  });

  it("should handle empty projects list", async () => {
    mockClient.testing.projects.getList.mockResolvedValue([]);

    const result = await listProjects();

    expect(result.content[0].text).toContain("No sandbox projects found");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox projects"
      );
    });

    const result = await listProjects();

    expect(mockClient.testing.projects.getList).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.projects.getList.mockRejectedValue(
      new Error("Network error")
    );

    const result = await listProjects();

    expect(result.content[0].text).toContain("Failed to list sandbox projects");
    expect(result.content[0].text).toContain("Network error");
    expect(result.isError).toBe(true);
  });
});
