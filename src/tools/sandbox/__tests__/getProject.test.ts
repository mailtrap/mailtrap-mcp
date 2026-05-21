import getProject from "../getProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { projects: { getById: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the project as JSON", async () => {
    mockClient.testing.projects.getById.mockResolvedValue({
      id: 7,
      name: "QA",
      inboxes: [],
    });

    const result = await getProject({ project_id: 7 });

    expect(mockClient.testing.projects.getById).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain('"name": "QA"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.projects.getById.mockRejectedValue(
      new Error("not found")
    );
    const result = await getProject({ project_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get sandbox project: not found"
    );
  });
});
