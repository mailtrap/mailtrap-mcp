import createSandboxInbox from "../createSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { inboxes: { create: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates an inbox and returns summary + JSON", async () => {
    mockClient.testing.inboxes.create.mockResolvedValue({
      id: 42,
      name: "Welcome",
      username: "u",
      password: "p",
    });

    const result = await createSandboxInbox({
      project_id: 7,
      name: "Welcome",
    });

    expect(mockClient.testing.inboxes.create).toHaveBeenCalledWith(
      7,
      "Welcome"
    );
    expect(result.content[0].text).toContain(
      'Sandbox inbox "Welcome" created.'
    );
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.inboxes.create.mockRejectedValue(new Error("forbidden"));
    const result = await createSandboxInbox({ project_id: 1, name: "x" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create sandbox inbox: forbidden"
    );
  });
});
