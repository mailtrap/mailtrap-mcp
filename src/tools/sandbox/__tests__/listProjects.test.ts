import listProjects from "../listProjects";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { projects: { getList: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns projects as JSON", async () => {
    mockClient.testing.projects.getList.mockResolvedValue([
      { id: 1, name: "Project A", inboxes: [] },
      { id: 2, name: "Project B", inboxes: [{ id: 10, name: "Inbox A" }] },
    ]);

    const result = await listProjects();

    expect(mockClient.testing.projects.getList).toHaveBeenCalledWith();
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"name": "Project A"');
    expect(result.content[0].text).toContain("Inbox A");
    expect(result.isError).toBeUndefined();
  });

  it("returns empty array when no projects", async () => {
    mockClient.testing.projects.getList.mockResolvedValue([]);
    const result = await listProjects();
    expect(result.content[0].text).toBe("[]");
  });

  it("surfaces API errors", async () => {
    mockClient.testing.projects.getList.mockRejectedValue(new Error("boom"));
    const result = await listProjects();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list sandbox projects: boom"
    );
  });
});
