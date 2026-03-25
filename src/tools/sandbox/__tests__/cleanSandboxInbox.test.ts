import cleanSandboxInbox from "../cleanSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    inboxes: {
      cleanInbox: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("cleanSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should clean an inbox successfully", async () => {
    const mockInbox = { id: 10, name: "Test Inbox", emails_count: 0 };
    mockClient.testing.inboxes.cleanInbox.mockResolvedValue(mockInbox);

    const result = await cleanSandboxInbox({ inbox_id: 10 });

    expect(requireClient).toHaveBeenCalledWith("sandbox inboxes");
    expect(mockClient.testing.inboxes.cleanInbox).toHaveBeenCalledWith(10);
    expect(result.content[0].text).toContain("All messages deleted");
    expect(result.content[0].text).toContain("Test Inbox");
    expect(result.content[0].text).toContain("ID: 10");
    expect(result.content[0].text).toContain("Emails remaining: 0");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox inboxes"
      );
    });

    const result = await cleanSandboxInbox({ inbox_id: 10 });

    expect(mockClient.testing.inboxes.cleanInbox).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.inboxes.cleanInbox.mockRejectedValue(
      new Error("Not found")
    );

    const result = await cleanSandboxInbox({ inbox_id: 999 });

    expect(result.content[0].text).toContain("Failed to clean sandbox inbox");
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
