import getEmailLogMessage from "../getEmailLogMessage";
import { requireClient } from "../../../client";
import mockEmailLogWithEvents from "../fixtures/emailLogMessageFixtures";

const mockClient = {
  emailLogs: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
}));

describe("getEmailLogMessage", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "456" });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.emailLogs.get.mockResolvedValue(mockEmailLogWithEvents);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should get email log message successfully", async () => {
    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(mockClient.emailLogs.get).toHaveBeenCalledWith("msg-uuid-123");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("msg-uuid-123");
    expect(result.content[0].text).toContain('"events"');
    expect(result.content[0].text).toContain("delivery");
    expect(result.content[0].text).toContain("2024-01-01T12:00:01Z");
  });

  it("should handle not found", async () => {
    mockClient.emailLogs.get.mockResolvedValue(null);

    const result = await getEmailLogMessage({ message_id: "missing-uuid" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("not found");
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for email logs"
      );
    });

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(mockClient.emailLogs.get).not.toHaveBeenCalled();
  });

  it("should require valid MAILTRAP_ACCOUNT_ID", async () => {
    process.env.MAILTRAP_ACCOUNT_ID = "invalid";
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for email logs"
      );
    });

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Not found");
    mockClient.emailLogs.get.mockRejectedValue(mockError);

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to get email log message");
    expect(result.content[0].text).toContain("Not found");
  });

  it("should include error field when present in log", async () => {
    mockClient.emailLogs.get.mockResolvedValue({
      ...mockEmailLogWithEvents,
      error: "Recipient mailbox full",
    });

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(result.content[0].text).toContain('"error"');
    expect(result.content[0].text).toContain("Recipient mailbox full");
  });
});
