import listWebhooks from "../listWebhooks";
import { requireClient } from "../../../client";

const mockClient = {
  webhooks: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listWebhooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the webhooks as JSON", async () => {
    mockClient.webhooks.getList.mockResolvedValue({
      data: [
        {
          id: 1,
          url: "https://example.com/hook",
          active: true,
          webhook_type: "email_sending",
          payload_format: "json",
          sending_stream: "transactional",
          event_types: ["delivery", "open"],
        },
        {
          id: 2,
          url: "https://example.com/audit",
          active: false,
          webhook_type: "audit_log",
          payload_format: "jsonlines",
        },
      ],
    });

    const result = await listWebhooks();

    expect(requireClient).toHaveBeenCalledWith("webhooks");
    expect(mockClient.webhooks.getList).toHaveBeenCalledWith();
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.content[0].text).toContain(
      '"url": "https://example.com/hook"'
    );
    expect(result.content[0].text).toContain('"webhook_type": "audit_log"');
    expect(result.isError).toBeUndefined();
  });

  it("returns the empty message when no webhooks exist", async () => {
    mockClient.webhooks.getList.mockResolvedValue({ data: [] });

    const result = await listWebhooks();

    expect(result.content[0].text).toBe(
      "No webhooks in your Mailtrap account."
    );
  });

  it("handles a response without data", async () => {
    mockClient.webhooks.getList.mockResolvedValue(undefined);

    const result = await listWebhooks();

    expect(result.content[0].text).toBe(
      "No webhooks in your Mailtrap account."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.webhooks.getList.mockRejectedValue(new Error("boom"));

    const result = await listWebhooks();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list webhooks: boom");
  });
});
