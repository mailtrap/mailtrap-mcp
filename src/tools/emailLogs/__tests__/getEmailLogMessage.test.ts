import getEmailLogMessage from "../getEmailLogMessage";
import { client } from "../../../client";
import mockEmailLogWithEvents from "../fixtures/emailLogMessageFixtures";

jest.mock("../../../client", () => ({
  client: {
    emailLogs: {
      get: jest.fn(),
    },
  },
}));

describe("getEmailLogMessage", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "456" });
    (client as any).emailLogs.get.mockResolvedValue(mockEmailLogWithEvents);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should get email log message successfully", async () => {
    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect((client as any).emailLogs.get).toHaveBeenCalledWith("msg-uuid-123");
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("Email Log Details");
    expect(result.content[0].text).toContain("msg-uuid-123");
    expect(result.content[0].text).toContain("Event history");
    expect(result.content[0].text).toContain("delivery: 2024-01-01T12:00:01Z");
    expect(result.content[0].text).toContain("open: 2024-01-01T12:00:05Z");
  });

  it("should handle not found", async () => {
    (client as any).emailLogs.get.mockResolvedValue(null);

    const result = await getEmailLogMessage({ message_id: "missing-uuid" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("not found");
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    delete process.env.MAILTRAP_ACCOUNT_ID;

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting email log message:",
      expect.anything()
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect((client as any).emailLogs.get).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should require valid MAILTRAP_ACCOUNT_ID", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    process.env.MAILTRAP_ACCOUNT_ID = "invalid";

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting email log message:",
      expect.anything()
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    consoleErrorSpy.mockRestore();
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Not found");
    (client as any).emailLogs.get.mockRejectedValue(mockError);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting email log message:",
      mockError
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to get email log message");
    expect(result.content[0].text).toContain("Not found");
    consoleErrorSpy.mockRestore();
  });

  it("should include error field when present in log", async () => {
    (client as any).emailLogs.get.mockResolvedValue({
      ...mockEmailLogWithEvents,
      error: "Recipient mailbox full",
    });

    const result = await getEmailLogMessage({ message_id: "msg-uuid-123" });

    expect(result.content[0].text).toContain("Error:");
    expect(result.content[0].text).toContain("Recipient mailbox full");
  });
});
