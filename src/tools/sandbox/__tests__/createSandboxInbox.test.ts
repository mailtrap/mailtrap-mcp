import createSandboxInbox from "../createSandboxInbox";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    inboxes: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("createSandboxInbox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should create an inbox successfully", async () => {
    const mockInbox = {
      id: 10,
      name: "Test Inbox",
      username: "user123",
      password: "pass456",
      domain: "sandbox.mailtrap.io",
      smtp_ports: [25, 465, 587, 2525],
      pop3_ports: [1100, 9950],
    };
    mockClient.testing.inboxes.create.mockResolvedValue(mockInbox);

    const result = await createSandboxInbox({
      project_id: 1,
      name: "Test Inbox",
    });

    expect(requireClient).toHaveBeenCalledWith("sandbox inboxes");
    expect(mockClient.testing.inboxes.create).toHaveBeenCalledWith(
      1,
      "Test Inbox"
    );
    expect(result.content[0].text).toContain("created successfully");
    expect(result.content[0].text).toContain("Test Inbox");
    expect(result.content[0].text).toContain("ID: 10");
    expect(result.content[0].text).toContain("SMTP Username: user123");
    expect(result.content[0].text).toContain("SMTP Password: pass456");
    expect(result.content[0].text).toContain("sandbox.mailtrap.io");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sandbox inboxes"
      );
    });

    const result = await createSandboxInbox({
      project_id: 1,
      name: "Test",
    });

    expect(mockClient.testing.inboxes.create).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.testing.inboxes.create.mockRejectedValue(
      new Error("Project not found")
    );

    const result = await createSandboxInbox({
      project_id: 999,
      name: "Test",
    });

    expect(result.content[0].text).toContain("Failed to create sandbox inbox");
    expect(result.content[0].text).toContain("Project not found");
    expect(result.isError).toBe(true);
  });
});
