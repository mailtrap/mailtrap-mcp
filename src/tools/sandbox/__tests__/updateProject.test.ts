import updateProject from "../updateProject";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    projects: {
      update: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("updateProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("updates project name", async () => {
    mockClient.testing.projects.update.mockResolvedValue({
      id: 1,
      name: "Renamed",
    });

    const result = await updateProject({ project_id: 1, name: "Renamed" });

    expect(requireClient).toHaveBeenCalledWith("sandbox projects");
    expect(mockClient.testing.projects.update).toHaveBeenCalledWith(
      1,
      "Renamed"
    );
    expect(result.content[0].text).toContain("updated successfully");
    expect(result.content[0].text).toContain("Renamed");
    expect(result.content[0].text).toContain("ID: 1");
    expect(result.isError).toBeUndefined();
  });

  it("handles API failure", async () => {
    mockClient.testing.projects.update.mockRejectedValue(
      new Error("Validation failed")
    );

    const result = await updateProject({ project_id: 1, name: "x" });

    expect(result.content[0].text).toContain(
      "Failed to update sandbox project"
    );
    expect(result.content[0].text).toContain("Validation failed");
    expect(result.isError).toBe(true);
  });
});
