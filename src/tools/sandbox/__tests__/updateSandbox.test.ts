import updateSandbox from "../updateSandbox";
import { requireClient } from "../../../client";

const mockClient = {
  sandbox: {
    sandboxes: {
      updateSandbox: jest.fn(),
    },
  },
};

const { sandboxes } = mockClient.sandbox;

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("updateSandbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should update sandbox name", async () => {
    const mockInbox = {
      id: 10,
      name: "Updated Name",
      email_username: "inbox10",
      email_domain: "inbox.mailtrap.io",
    };
    sandboxes.updateSandbox.mockResolvedValue(mockInbox);

    const result = await updateSandbox({
      sandbox_id: 10,
      name: "Updated Name",
    });

    expect(requireClient).toHaveBeenCalledWith("sandboxes");
    expect(sandboxes.updateSandbox).toHaveBeenCalledWith(10, {
      name: "Updated Name",
    });
    expect(result.content[0].text).toContain("updated successfully");
    expect(result.content[0].text).toContain("Updated Name");
    expect(result.isError).toBeUndefined();
  });

  it("should accept the legacy inbox_id", async () => {
    sandboxes.updateSandbox.mockResolvedValue({
      id: 30,
      name: "Renamed",
    });

    const result = await updateSandbox({ inbox_id: 30, name: "Renamed" });

    expect(sandboxes.updateSandbox).toHaveBeenCalledWith(30, {
      name: "Renamed",
    });
    expect(result.isError).toBeUndefined();
  });

  it("should update email username", async () => {
    const mockInbox = {
      id: 10,
      name: "My Inbox",
      email_username: "new-username",
      email_domain: "inbox.mailtrap.io",
    };
    sandboxes.updateSandbox.mockResolvedValue(mockInbox);

    const result = await updateSandbox({
      sandbox_id: 10,
      email_username: "new-username",
    });

    expect(sandboxes.updateSandbox).toHaveBeenCalledWith(10, {
      emailUsername: "new-username",
    });
    expect(result.content[0].text).toContain("new-username@inbox.mailtrap.io");
    expect(result.isError).toBeUndefined();
  });

  it("should update both name and email_username", async () => {
    const mockInbox = {
      id: 10,
      name: "New Name",
      email_username: "new-user",
      email_domain: "inbox.mailtrap.io",
    };
    sandboxes.updateSandbox.mockResolvedValue(mockInbox);

    const result = await updateSandbox({
      sandbox_id: 10,
      name: "New Name",
      email_username: "new-user",
    });

    expect(sandboxes.updateSandbox).toHaveBeenCalledWith(10, {
      name: "New Name",
      emailUsername: "new-user",
    });
    expect(result.isError).toBeUndefined();
  });

  it("should error when neither name nor email_username provided", async () => {
    const result = await updateSandbox({ sandbox_id: 10 });

    expect(sandboxes.updateSandbox).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain(
      "At least one of 'name' or 'email_username'"
    );
    expect(result.isError).toBe(true);
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandboxes"
      );
    });

    const result = await updateSandbox({
      sandbox_id: 10,
      name: "Test",
    });

    expect(sandboxes.updateSandbox).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    sandboxes.updateSandbox.mockRejectedValue(new Error("Not found"));

    const result = await updateSandbox({
      sandbox_id: 999,
      name: "Test",
    });

    expect(result.content[0].text).toContain("Failed to update sandbox");
    expect(result.content[0].text).toContain("Not found");
    expect(result.isError).toBe(true);
  });
});
