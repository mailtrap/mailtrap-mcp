import updateWebhook from "../updateWebhook";
import { requireClient } from "../../../client";

const mockClient = {
  webhooks: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates the webhook and returns the JSON response", async () => {
    mockClient.webhooks.update.mockResolvedValue({
      data: {
        id: 42,
        url: "https://example.com/new-hook",
        active: false,
        webhook_type: "email_sending",
        payload_format: "jsonlines",
        sending_stream: "transactional",
        event_types: ["delivery", "open", "click"],
      },
    });

    const result = await updateWebhook({
      webhook_id: 42,
      url: "https://example.com/new-hook",
      active: false,
      payload_format: "jsonlines",
      event_types: ["delivery", "open", "click"],
    });

    expect(requireClient).toHaveBeenCalledWith("webhooks");
    expect(mockClient.webhooks.update).toHaveBeenCalledWith(42, {
      url: "https://example.com/new-hook",
      active: false,
      payload_format: "jsonlines",
      event_types: ["delivery", "open", "click"],
    });
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain('"active": false');
    expect(result.content[0].text).toContain('"payload_format": "jsonlines"');
    expect(result.isError).toBeUndefined();
  });

  it("passes only the fields the caller actually provided", async () => {
    mockClient.webhooks.update.mockResolvedValue({
      data: {
        id: 42,
        url: "https://example.com/hook",
        active: false,
        webhook_type: "email_sending",
        payload_format: "json",
      },
    });

    await updateWebhook({ webhook_id: 42, active: false });

    expect(mockClient.webhooks.update).toHaveBeenCalledWith(42, {
      active: false,
    });
  });

  it("surfaces API errors", async () => {
    mockClient.webhooks.update.mockRejectedValue(
      new Error("validation failed")
    );

    const result = await updateWebhook({
      webhook_id: 42,
      url: "bad",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update webhook: validation failed"
    );
  });
});
