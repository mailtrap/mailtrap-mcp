import updateSandboxInbox from "../updateSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: { inboxes: { updateInbox: jest.fn() } },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates the inbox and returns summary + JSON", async () => {
    mockClient.testing.inboxes.updateInbox.mockResolvedValue({
      id: 42,
      name: "Renamed",
      email_username: "new",
      email_domain: "inbox.mailtrap.io",
    });

    const result = await updateSandboxInbox({
      inbox_id: 42,
      name: "Renamed",
      email_username: "new",
    });

    expect(mockClient.testing.inboxes.updateInbox).toHaveBeenCalledWith(42, {
      name: "Renamed",
      emailUsername: "new",
    });
    expect(result.content[0].text).toContain("Sandbox inbox 42 updated.");
    expect(result.content[0].text).toContain('"name": "Renamed"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects when no update fields provided", async () => {
    const result = await updateSandboxInbox({ inbox_id: 42 });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("'name' or 'email_username'");
  });

  it("surfaces API errors", async () => {
    mockClient.testing.inboxes.updateInbox.mockRejectedValue(
      new Error("not found")
    );
    const result = await updateSandboxInbox({
      inbox_id: 99,
      name: "x",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update sandbox inbox: not found"
    );
  });
});
