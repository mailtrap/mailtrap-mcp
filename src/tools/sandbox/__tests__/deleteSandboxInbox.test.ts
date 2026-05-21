import deleteSandboxInbox from "../deleteSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { inboxes: { delete: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the inbox and returns summary + JSON", async () => {
    mockClient.testing.inboxes.delete.mockResolvedValue({
      id: 42,
      name: "Welcome",
    });

    const result = await deleteSandboxInbox({ inbox_id: 42 });

    expect(mockClient.testing.inboxes.delete).toHaveBeenCalledWith(42);
    expect(result.content[0].text).toContain("Sandbox inbox 42 deleted.");
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.inboxes.delete.mockRejectedValue(new Error("not found"));
    const result = await deleteSandboxInbox({ inbox_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete sandbox inbox: not found"
    );
  });
});
