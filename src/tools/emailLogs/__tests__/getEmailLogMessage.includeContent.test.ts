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

describe("getEmailLogMessage include_content", () => {
  const rawUrl = "https://api.mailtrap.io/raw/eml/msg-123";
  const originalEnv = { ...process.env };

  function multipartEml(): Buffer {
    const lines = [
      "From: a@b.c",
      "To: x@y.z",
      "Subject: T",
      "MIME-Version: 1.0",
      'Content-Type: multipart/alternative; boundary="b"',
      "",
      "--b",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      "Hello plain",
      "--b",
      "Content-Type: text/html; charset=UTF-8",
      "",
      "<p>Hello html</p>",
      "--b--",
    ];
    return Buffer.from(lines.join("\r\n"), "utf8");
  }

  function toArrayBuffer(buf: Buffer): ArrayBuffer {
    return buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    ) as ArrayBuffer;
  }

  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "456" });
    (client as any).emailLogs.get.mockResolvedValue(mockEmailLogWithEvents);
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation();
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    Object.assign(process.env, originalEnv);
  });

  it("should not fetch when include_content is false", async () => {
    await getEmailLogMessage({
      message_id: "msg-uuid-123",
      include_content: false,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should not fetch when raw_message_url is missing", async () => {
    await getEmailLogMessage({
      message_id: "msg-uuid-123",
      include_content: true,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should fetch raw message URL and append parsed HTML and text bodies", async () => {
    (client as any).emailLogs.get.mockResolvedValue({
      ...mockEmailLogWithEvents,
      raw_message_url: rawUrl,
    });
    fetchSpy.mockResolvedValue({
      ok: true,
      arrayBuffer: async () => toArrayBuffer(multipartEml()),
    } as Response);

    const result = await getEmailLogMessage({
      message_id: "msg-uuid-123",
      include_content: true,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(rawUrl, {
      signal: expect.any(AbortSignal),
    });

    expect(result.content[0].text).toContain("Email Log Details");
    expect(result.content[0].text).toContain("--- HTML Content ---");
    expect(result.content[0].text).toContain("<p>Hello html</p>");
    expect(result.content[0].text).toContain("--- Text Content ---");
    expect(result.content[0].text).toContain("Hello plain");
  });

  it("should report fetch failure status when response not ok", async () => {
    (client as any).emailLogs.get.mockResolvedValue({
      ...mockEmailLogWithEvents,
      raw_message_url: rawUrl,
    });
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);

    const result = await getEmailLogMessage({
      message_id: "msg-uuid-123",
      include_content: true,
    });

    expect(result.content[0].text).toContain("Failed to fetch (403)");
  });

  it("should report fetch/parse errors in content", async () => {
    (client as any).emailLogs.get.mockResolvedValue({
      ...mockEmailLogWithEvents,
      raw_message_url: rawUrl,
    });
    fetchSpy.mockRejectedValue(new Error("network down"));

    const result = await getEmailLogMessage({
      message_id: "msg-uuid-123",
      include_content: true,
    });

    expect(result.content[0].text).toContain("Error fetching or parsing");
    expect(result.content[0].text).toContain("network down");
  });

  it("should report when EML has no text or html parts", async () => {
    (client as any).emailLogs.get.mockResolvedValue({
      ...mockEmailLogWithEvents,
      raw_message_url: rawUrl,
    });
    const emptyMime = Buffer.from(
      [
        "From: a@b.c",
        "To: x@y.z",
        "Subject: T",
        "MIME-Version: 1.0",
        "Content-Type: application/octet-stream",
        "",
        "binary only",
      ].join("\r\n"),
      "utf8"
    );
    fetchSpy.mockResolvedValue({
      ok: true,
      arrayBuffer: async () => toArrayBuffer(emptyMime),
    } as Response);

    const result = await getEmailLogMessage({
      message_id: "msg-uuid-123",
      include_content: true,
    });

    expect(result.content[0].text).toContain(
      "No HTML or text body found in message"
    );
  });
});
