import listEmailLogs from "../listEmailLogs";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    emailLogs: {
      getList: jest.fn(),
    },
  },
}));

describe("listEmailLogs", () => {
  const mockLogs = [
    {
      id: "msg-uuid-1",
      status: "delivered",
      from: "sender@example.com",
      to: "user@example.com",
      subject: "Test 1",
      sent_at: "2024-01-01T12:00:00Z",
    },
    {
      id: "msg-uuid-2",
      status: "bounced",
      from: "noreply@example.com",
      to: "invalid@example.com",
      subject: "Test 2",
      sent_at: "2024-01-02T12:00:00Z",
    },
  ];

  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "456" });
    (client as any).emailLogs.getList.mockResolvedValue({ messages: mockLogs });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should list email logs successfully", async () => {
    const result = await listEmailLogs({});

    expect((client as any).emailLogs.getList).toHaveBeenCalledWith(undefined);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("Found 2 email log message(s)");
    expect(result.content[0].text).toContain("msg-uuid-1");
    expect(result.content[0].text).toContain("delivered");
    expect(result.content[0].text).toContain("sender@example.com");
    expect(result.content[0].text).toContain("user@example.com");
    expect(result.content[0].text).toContain("Test 1");
  });

  it("should handle empty logs list", async () => {
    (client as any).emailLogs.getList.mockResolvedValue({ messages: [] });

    const result = await listEmailLogs({});

    expect(result.content[0].text).toContain("No email log messages found");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    delete process.env.MAILTRAP_ACCOUNT_ID;

    const result = await listEmailLogs({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error listing email log messages:",
      expect.anything()
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect((client as any).emailLogs.getList).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should require valid MAILTRAP_ACCOUNT_ID", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    process.env.MAILTRAP_ACCOUNT_ID = "not-a-number";

    const result = await listEmailLogs({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error listing email log messages:",
      expect.anything()
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    consoleErrorSpy.mockRestore();
  });

  it("should pass search_after to getList", async () => {
    await listEmailLogs({ search_after: "cursor-abc" });

    expect((client as any).emailLogs.getList).toHaveBeenCalledWith({
      search_after: "cursor-abc",
    });
  });

  it("should pass filters with operator to getList", async () => {
    await listEmailLogs({
      sent_after: "2024-01-01T00:00:00Z",
      from_email: "noreply@example.com",
      status: "delivered",
    });

    expect((client as any).emailLogs.getList).toHaveBeenCalledWith({
      filters: {
        sent_after: "2024-01-01T00:00:00Z",
        from: { operator: "ci_equal", value: "noreply@example.com" },
        status: { operator: "equal", value: "delivered" },
      },
    });
  });

  it("should pass explicit from_operator and status_operator to getList", async () => {
    await listEmailLogs({
      from_email: "user@example.com",
      from_operator: "ci_contain",
      status: "not_delivered",
      status_operator: "not_equal",
    });

    expect((client as any).emailLogs.getList).toHaveBeenCalledWith({
      filters: {
        from: { operator: "ci_contain", value: "user@example.com" },
        status: { operator: "not_equal", value: "not_delivered" },
      },
    });
  });

  it("should pass multiple category values as array to getList", async () => {
    await listEmailLogs({
      category: ["Newsletter", "Alert"],
      category_operator: "equal",
    });

    expect((client as any).emailLogs.getList).toHaveBeenCalledWith({
      filters: {
        category: {
          operator: "equal",
          value: ["Newsletter", "Alert"],
        },
      },
    });
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    (client as any).emailLogs.getList.mockRejectedValue(mockError);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await listEmailLogs({});

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error listing email log messages:",
      mockError
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Failed to list email log messages"
    );
    expect(result.content[0].text).toContain("API Error");
    consoleErrorSpy.mockRestore();
  });

  it("should include next_page_cursor when present", async () => {
    (client as any).emailLogs.getList.mockResolvedValue({
      messages: mockLogs,
      next_page_cursor: "next-cursor-xyz",
    });

    const result = await listEmailLogs({});

    expect(result.content[0].text).toContain("Next page");
    expect(result.content[0].text).toContain("search_after");
    expect(result.content[0].text).toContain("next-cursor-xyz");
  });
});
