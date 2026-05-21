import getMessages from "../getSandboxMessages";
import { getSandboxClient } from "../../../client";

const mockSandboxClient = {
  testing: { messages: { get: jest.fn() } },
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

describe("getSandboxMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, { MAILTRAP_TEST_INBOX_ID: "1234" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("returns messages as JSON", async () => {
    mockSandboxClient.testing.messages.get.mockResolvedValue([
      { id: 1, from_email: "a@b.c", subject: "Hello" },
      { id: 2, from_email: "x@y.z", subject: "World" },
    ]);

    const result = await getMessages({});

    expect(mockSandboxClient.testing.messages.get).toHaveBeenCalledWith(
      1234,
      undefined
    );
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain('"subject": "Hello"');
    expect(result.isError).toBeUndefined();
  });

  it("passes pagination options through", async () => {
    mockSandboxClient.testing.messages.get.mockResolvedValue([]);

    await getMessages({ page: 2, last_id: 99, search: "foo" });

    expect(mockSandboxClient.testing.messages.get).toHaveBeenCalledWith(1234, {
      page: 2,
      last_id: 99,
      search: "foo",
    });
  });

  it("returns empty array when no messages", async () => {
    mockSandboxClient.testing.messages.get.mockResolvedValue([]);
    const result = await getMessages({});
    expect(result.content[0].text).toBe("[]");
  });

  it("errors when no test_inbox_id available", async () => {
    delete process.env.MAILTRAP_TEST_INBOX_ID;
    const result = await getMessages({});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("MAILTRAP_TEST_INBOX_ID");
  });

  it("surfaces API errors", async () => {
    mockSandboxClient.testing.messages.get.mockRejectedValue(new Error("boom"));
    const result = await getMessages({});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get sandbox messages: boom");
  });
});
