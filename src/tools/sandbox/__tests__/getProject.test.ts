import getProject from "../getProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    projects: {
      getById: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("getProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("returns project with inboxes", async () => {
    const mockProject = {
      id: 1,
      name: "Project A",
      inboxes: [
        { id: 10, name: "Inbox 1", emails_count: 5 },
        { id: 11, name: "Inbox 2", emails_count: 0 },
      ],
    };
    mockClient.testing.projects.getById.mockResolvedValue(mockProject);

    const result = await getProject({ project_id: 1 });

    expect(requireClient).toHaveBeenCalledWith("sandbox projects");
    expect(mockClient.testing.projects.getById).toHaveBeenCalledWith(1);
    expect(result.content[0].text).toContain(
      "Sandbox project: Project A (ID: 1)"
    );
    expect(result.content[0].text).toContain("Inboxes (2):");
    expect(result.content[0].text).toContain("- Inbox 1 (ID: 10, emails: 5)");
    expect(result.content[0].text).toContain("- Inbox 2 (ID: 11, emails: 0)");
    expect(result.isError).toBeUndefined();
  });

  it("handles project with no inboxes", async () => {
    mockClient.testing.projects.getById.mockResolvedValue({
      id: 2,
      name: "Empty",
      inboxes: [],
    });

    const result = await getProject({ project_id: 2 });

    expect(result.content[0].text).toContain("Inboxes (0):");
    expect(result.content[0].text).toContain("(no inboxes)");
  });

  it("handles API failure", async () => {
    mockClient.testing.projects.getById.mockRejectedValue(
      new Error("Not found")
    );

    const result = await getProject({ project_id: 99 });

    expect(result.content[0].text).toContain("Failed to get sandbox project");
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
