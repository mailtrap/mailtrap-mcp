import cleanSandboxInbox from "../cleanSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { inboxes: { cleanInbox: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("cleanSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("cleans the inbox and returns summary + JSON", async () => {
    mockClient.testing.inboxes.cleanInbox.mockResolvedValue({
      id: 42,
      name: "Welcome",
      emails_count: 0,
    });

    const result = await cleanSandboxInbox({ inbox_id: 42 });

    expect(mockClient.testing.inboxes.cleanInbox).toHaveBeenCalledWith(42);
    expect(result.content[0].text).toContain("Sandbox inbox 42 cleaned.");
    expect(result.content[0].text).toContain('"emails_count": 0');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.testing.inboxes.cleanInbox.mockRejectedValue(
      new Error("not found")
    );
    const result = await cleanSandboxInbox({ inbox_id: 99 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to clean sandbox inbox: not found"
    );
  });
});
