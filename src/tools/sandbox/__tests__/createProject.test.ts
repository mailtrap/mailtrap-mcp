import createProject from "../createProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { projects: { create: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a project and returns summary + JSON", async () => {
    mockClient.testing.projects.create.mockResolvedValue({
      id: 7,
      name: "QA",
    });

    const result = await createProject({ name: "QA" });

    expect(mockClient.testing.projects.create).toHaveBeenCalledWith("QA");
    expect(result.content[0].text).toContain('Sandbox project "QA" created.');
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.projects.create.mockRejectedValue(
      new Error("name taken")
    );
    const result = await createProject({ name: "Dup" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create sandbox project: name taken"
    );
  });
});
