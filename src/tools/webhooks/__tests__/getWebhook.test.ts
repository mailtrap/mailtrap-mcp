import getWebhook from "../getWebhook";
import { requireClient } from "../../../client";

const mockClient = {
  webhooks: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the webhook as JSON", async () => {
    mockClient.webhooks.get.mockResolvedValue({
      data: {
        id: 7,
        url: "https://example.com/hook",
        active: true,
        webhook_type: "email_sending",
        payload_format: "json",
        sending_stream: "transactional",
        event_types: ["delivery"],
      },
    });

    const result = await getWebhook({ webhook_id: 7 });

    expect(requireClient).toHaveBeenCalledWith("webhooks");
    expect(mockClient.webhooks.get).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.content[0].text).toContain(
      '"url": "https://example.com/hook"'
    );
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.webhooks.get.mockRejectedValue(new Error("not found"));

    const result = await getWebhook({ webhook_id: 7 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get webhook: not found");
  });
});
