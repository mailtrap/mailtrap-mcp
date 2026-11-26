import { getSandboxClient, requireClient } from "../../client";
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  updateTemplate,
} from "../templates";
import { getMessages, sendSandboxEmail, showEmailMessage } from "../sandbox";
import { getEmailLogMessage, listEmailLogs } from "../emailLogs";

jest.mock("../../client", () => ({
  requireClient: jest.fn(),
  getSandboxClient: jest.fn(),
}));

const API_TOKEN = "secret-api-token-123";

// Mirrors the SDK's MailtrapError, which the package does not export.
class MailtrapError extends Error {}

// The SDK wraps the AxiosError in `cause`; its `request._header` holds the
// raw request headers, including the Authorization header with the API token.
function buildApiError(): MailtrapError {
  return new MailtrapError("Unauthorized", {
    cause: {
      name: "AxiosError",
      message: "Request failed with status code 401",
      request: {
        _header: `GET /api/accounts/1/templates HTTP/1.1\r\nAuthorization: Bearer ${API_TOKEN}\r\n\r\n`,
      },
      config: { headers: { Authorization: `Bearer ${API_TOKEN}` } },
    },
  });
}

const reject = () => jest.fn().mockRejectedValue(buildApiError());

describe("API errors are not logged", () => {
  const originalEnv = { ...process.env };
  let spies: jest.SpyInstance[];

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, {
      MAILTRAP_ACCOUNT_ID: "1",
      MAILTRAP_SANDBOX_ID: "2",
    });
    (requireClient as jest.Mock).mockReturnValue({
      templates: {
        getList: reject(),
        get: reject(),
        create: reject(),
        update: reject(),
        delete: reject(),
      },
      emailLogs: { getList: reject(), get: reject() },
    });
    (getSandboxClient as jest.Mock).mockReturnValue({
      send: reject(),
      testing: {
        messages: {
          get: reject(),
          showEmailMessage: reject(),
        },
      },
    });
    spies = [
      jest.spyOn(console, "error").mockImplementation(() => {}),
      jest.spyOn(console, "warn").mockImplementation(() => {}),
      jest.spyOn(console, "log").mockImplementation(() => {}),
      jest.spyOn(process.stderr, "write").mockImplementation(() => true),
    ];
  });

  afterEach(() => {
    spies.forEach((spy) => spy.mockRestore());
    Object.assign(process.env, originalEnv);
  });

  it.each([
    ["listTemplates", () => listTemplates({}), "list templates"],
    ["getTemplate", () => getTemplate({ template_id: 1 }), "get template"],
    [
      "createTemplate",
      () => createTemplate({ name: "n", subject: "s", text: "t" }),
      "create template",
    ],
    [
      "updateTemplate",
      () => updateTemplate({ template_id: 1, name: "n" }),
      "update template",
    ],
    [
      "deleteTemplate",
      () => deleteTemplate({ template_id: 1 }),
      "delete template",
    ],
    ["getMessages", () => getMessages({}), "get messages"],
    [
      "sendSandboxEmail",
      () =>
        sendSandboxEmail({
          from: "from@example.com",
          to: "to@example.com",
          subject: "s",
          text: "t",
        }),
      "send sandbox email",
    ],
    [
      "showEmailMessage",
      () => showEmailMessage({ message_id: 1 }),
      "show sandbox email message",
    ],
    ["listEmailLogs", () => listEmailLogs({}), "list email log messages"],
    [
      "getEmailLogMessage",
      () => getEmailLogMessage({ message_id: "abc" }),
      "get email log message",
    ],
  ])(
    "%s returns the error message without writing to stderr",
    async (_name, call, action) => {
      const result = await call();

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toBe(`Failed to ${action}: Unauthorized`);
      expect(JSON.stringify(result)).not.toContain(API_TOKEN);
      spies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
    }
  );

  it("showEmailMessage skips failed body and report fetches without writing to stderr", async () => {
    (getSandboxClient as jest.Mock).mockReturnValue({
      testing: {
        messages: {
          showEmailMessage: jest.fn().mockResolvedValue({ id: 1 }),
          getHtmlMessage: reject(),
          getTextMessage: reject(),
          getSpamScore: reject(),
          getHtmlAnalysis: reject(),
        },
      },
    });

    const result = await showEmailMessage({
      message_id: 1,
      include_spam_report: true,
      include_html_analysis: true,
    });

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "Spam report could not be retrieved"
    );
    expect(JSON.stringify(result)).not.toContain(API_TOKEN);
    spies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });
});
