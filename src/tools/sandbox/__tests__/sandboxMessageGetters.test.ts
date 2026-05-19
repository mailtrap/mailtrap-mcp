import deleteSandboxMessage from "../deleteSandboxMessage";
import getSandboxMessageSpamScore from "../getSandboxMessageSpamScore";
import getSandboxMessageHtmlAnalysis from "../getSandboxMessageHtmlAnalysis";
import getSandboxMessageHeaders from "../getSandboxMessageHeaders";
import getSandboxMessageHtml from "../getSandboxMessageHtml";
import getSandboxMessageText from "../getSandboxMessageText";
import getSandboxMessageRaw from "../getSandboxMessageRaw";
import getSandboxMessageEml from "../getSandboxMessageEml";
import getSandboxMessageHtmlSource from "../getSandboxMessageHtmlSource";
import { getSandboxClient } from "../../../client";

const mockSandboxClient = {
  testing: {
    messages: {
      deleteMessage: jest.fn(),
      getSpamScore: jest.fn(),
      getHtmlAnalysis: jest.fn(),
      getMailHeaders: jest.fn(),
      getHtmlMessage: jest.fn(),
      getTextMessage: jest.fn(),
      getRawMessage: jest.fn(),
      getMessageAsEml: jest.fn(),
      getMessageHtmlSource: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

const cases: Array<{
  name: string;
  handler: any;
  method: keyof typeof mockSandboxClient.testing.messages;
  mockValue: unknown;
  expectedFragment: string;
}> = [
  {
    name: "deleteSandboxMessage",
    handler: deleteSandboxMessage,
    method: "deleteMessage",
    mockValue: {},
    expectedFragment: "Sandbox message 99 deleted",
  },
  {
    name: "getSandboxMessageSpamScore",
    handler: getSandboxMessageSpamScore,
    method: "getSpamScore",
    mockValue: { score: 2.1 },
    expectedFragment: '"score": 2.1',
  },
  {
    name: "getSandboxMessageHtmlAnalysis",
    handler: getSandboxMessageHtmlAnalysis,
    method: "getHtmlAnalysis",
    mockValue: { html_compatibility_score: 90 },
    expectedFragment: '"html_compatibility_score": 90',
  },
  {
    name: "getSandboxMessageHeaders",
    handler: getSandboxMessageHeaders,
    method: "getMailHeaders",
    mockValue: { headers: [{ key: "Subject", value: "Hi" }] },
    expectedFragment: '"Subject"',
  },
  {
    name: "getSandboxMessageHtml",
    handler: getSandboxMessageHtml,
    method: "getHtmlMessage",
    mockValue: "<p>hi</p>",
    expectedFragment: "<p>hi</p>",
  },
  {
    name: "getSandboxMessageText",
    handler: getSandboxMessageText,
    method: "getTextMessage",
    mockValue: "hello",
    expectedFragment: "hello",
  },
  {
    name: "getSandboxMessageRaw",
    handler: getSandboxMessageRaw,
    method: "getRawMessage",
    mockValue: "Subject: test\r\n",
    expectedFragment: "Subject: test",
  },
  {
    name: "getSandboxMessageEml",
    handler: getSandboxMessageEml,
    method: "getMessageAsEml",
    mockValue: "Content-Type: text/plain",
    expectedFragment: "Content-Type",
  },
  {
    name: "getSandboxMessageHtmlSource",
    handler: getSandboxMessageHtmlSource,
    method: "getMessageHtmlSource",
    mockValue: "<html></html>",
    expectedFragment: "<html></html>",
  },
];

describe("sandbox message getter tools", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, { MAILTRAP_SANDBOX_ID: "1234" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it.each(cases)(
    "$name calls the SDK and returns the response",
    async ({ handler, method, mockValue, expectedFragment }) => {
      (
        mockSandboxClient.testing.messages[method] as jest.Mock
      ).mockResolvedValue(mockValue);

      const result = await handler({ message_id: 99 });

      expect(mockSandboxClient.testing.messages[method]).toHaveBeenCalledWith(
        1234,
        99
      );
      expect(result.content[0].text).toContain(expectedFragment);
      expect(result.isError).toBeUndefined();
    }
  );

  it.each(cases)("$name surfaces API errors", async ({ handler, method }) => {
    (mockSandboxClient.testing.messages[method] as jest.Mock).mockRejectedValue(
      new Error("boom")
    );

    const result = await handler({ message_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("boom");
  });
});
