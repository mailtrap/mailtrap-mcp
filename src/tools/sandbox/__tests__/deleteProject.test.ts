import deleteProject from "../deleteProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { projects: { delete: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the project and returns summary + JSON", async () => {
    mockClient.testing.projects.delete.mockResolvedValue({
      id: 7,
      name: "QA",
    });

    const result = await deleteProject({ project_id: 7 });

    expect(mockClient.testing.projects.delete).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain("Sandbox project 7 deleted.");
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.projects.delete.mockRejectedValue(
      new Error("not found")
    );
    const result = await deleteProject({ project_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete sandbox project: not found"
    );
  });
});
