import createWebhook from "../createWebhook";
import { requireClient } from "../../../client";

const mockClient = {
  webhooks: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a webhook and returns the response including the signing_secret", async () => {
    mockClient.webhooks.create.mockResolvedValue({
      data: {
        id: 42,
        url: "https://example.com/hook",
        active: true,
        webhook_type: "email_sending",
        payload_format: "json",
        sending_stream: "transactional",
        event_types: ["delivery", "open"],
        signing_secret: "whsec_abc123",
      },
    });

    const result = await createWebhook({
      url: "https://example.com/hook",
      webhook_type: "email_sending",
      sending_stream: "transactional",
      event_types: ["delivery", "open"],
    });

    expect(requireClient).toHaveBeenCalledWith("webhooks");
    expect(mockClient.webhooks.create).toHaveBeenCalledWith({
      url: "https://example.com/hook",
      webhook_type: "email_sending",
      sending_stream: "transactional",
      event_types: ["delivery", "open"],
    });
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain(
      '"signing_secret": "whsec_abc123"'
    );
    expect(result.isError).toBeUndefined();
  });

  it("passes only the required fields through when optionals are omitted", async () => {
    mockClient.webhooks.create.mockResolvedValue({
      data: {
        id: 43,
        url: "https://example.com/audit",
        active: true,
        webhook_type: "audit_log",
        payload_format: "json",
        signing_secret: "whsec_xyz",
      },
    });

    await createWebhook({
      url: "https://example.com/audit",
      webhook_type: "audit_log",
    });

    expect(mockClient.webhooks.create).toHaveBeenCalledWith({
      url: "https://example.com/audit",
      webhook_type: "audit_log",
    });
  });

  it("surfaces API errors", async () => {
    mockClient.webhooks.create.mockRejectedValue(new Error("url is invalid"));

    const result = await createWebhook({
      url: "not-a-url",
      webhook_type: "email_sending",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create webhook: url is invalid"
    );
  });
});
