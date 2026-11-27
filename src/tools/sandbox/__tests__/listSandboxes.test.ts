import listSandboxes from "../listSandboxes";
import { requireClient } from "../../../client";

const mockClient = {
  sandbox: {
    sandboxes: {
      getList: jest.fn(),
    },
  },
};

const { sandboxes } = mockClient.sandbox;

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listSandboxes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("renders all sandboxes", async () => {
    sandboxes.getList.mockResolvedValue([
      { id: 1, name: "A", project_id: 10, emails_count: 4 },
      { id: 2, name: "B", project_id: 11, emails_count: 0 },
    ]);

    const result = await listSandboxes();

    expect(requireClient).toHaveBeenCalledWith("sandboxes");
    expect(result.content[0].text).toContain("Sandboxes (2):");
    expect(result.content[0].text).toContain(
      "A (ID: 1, project: 10, emails: 4)"
    );
    expect(result.content[0].text).toContain(
      "B (ID: 2, project: 11, emails: 0)"
    );
    expect(result.isError).toBeUndefined();
  });

  it("handles empty list", async () => {
    sandboxes.getList.mockResolvedValue([]);

    const result = await listSandboxes();

    expect(result.content[0].text).toContain("No sandboxes");
  });

  it("handles API failure", async () => {
    sandboxes.getList.mockRejectedValue(new Error("boom"));

    const result = await listSandboxes();

    expect(result.content[0].text).toContain("Failed to list sandboxes");
    expect(result.isError).toBe(true);
  });
});
