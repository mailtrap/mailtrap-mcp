import deleteWebhook from "../deleteWebhook";
import { requireClient } from "../../../client";

const mockClient = {
  webhooks: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the webhook and returns the deleted record as JSON", async () => {
    mockClient.webhooks.delete.mockResolvedValue({
      data: {
        id: 42,
        url: "https://example.com/hook",
        active: true,
        webhook_type: "email_sending",
        payload_format: "json",
      },
    });

    const result = await deleteWebhook({ webhook_id: 42 });

    expect(requireClient).toHaveBeenCalledWith("webhooks");
    expect(mockClient.webhooks.delete).toHaveBeenCalledWith(42);
    expect(result.content[0].text).toContain('"id": 42');
    expect(result.content[0].text).toContain(
      '"url": "https://example.com/hook"'
    );
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.webhooks.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteWebhook({ webhook_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to delete webhook: not found");
  });
});
