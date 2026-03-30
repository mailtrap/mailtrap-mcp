import deleteSandboxInbox from "../deleteSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    inboxes: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("deleteSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should delete an inbox successfully", async () => {
    const mockInbox = { id: 10, name: "Old Inbox" };
    mockClient.testing.inboxes.delete.mockResolvedValue(mockInbox);

    const result = await deleteSandboxInbox({ inbox_id: 10 });

    expect(requireClient).toHaveBeenCalledWith("sandbox inboxes");
    expect(mockClient.testing.inboxes.delete).toHaveBeenCalledWith(10);
    expect(result.content[0].text).toContain("deleted successfully");
    expect(result.content[0].text).toContain("Old Inbox");
    expect(result.content[0].text).toContain("ID: 10");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox inboxes"
      );
    });

    const result = await deleteSandboxInbox({ inbox_id: 10 });

    expect(mockClient.testing.inboxes.delete).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.inboxes.delete.mockRejectedValue(new Error("Not found"));

    const result = await deleteSandboxInbox({ inbox_id: 999 });

    expect(result.content[0].text).toContain("Failed to delete sandbox inbox");
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
