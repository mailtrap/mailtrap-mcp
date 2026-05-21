import updateProject from "../updateProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { projects: { update: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("renames the project and returns summary + JSON", async () => {
    mockClient.testing.projects.update.mockResolvedValue({
      id: 7,
      name: "Renamed",
    });

    const result = await updateProject({ project_id: 7, name: "Renamed" });

    expect(mockClient.testing.projects.update).toHaveBeenCalledWith(
      7,
      "Renamed"
    );
    expect(result.content[0].text).toContain("Sandbox project 7 updated.");
    expect(result.content[0].text).toContain('"name": "Renamed"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.projects.update.mockRejectedValue(
      new Error("not found")
    );
    const result = await updateProject({ project_id: 99, name: "x" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update sandbox project: not found"
    );
  });
});
