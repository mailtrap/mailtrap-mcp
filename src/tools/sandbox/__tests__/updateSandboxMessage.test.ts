import updateSandboxMessage from "../updateSandboxMessage";
import { getSandboxClient } from "../../../client";

const mockSandboxClient = {
  testing: {
    messages: {
      updateMessage: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

describe("updateSandboxMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, { MAILTRAP_SANDBOX_ID: "1234" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("marks the message as read", async () => {
    mockSandboxClient.testing.messages.updateMessage.mockResolvedValue({
      id: 99,
      is_read: true,
    });

    const result = await updateSandboxMessage({
      message_id: 99,
      is_read: true,
    });

    expect(
      mockSandboxClient.testing.messages.updateMessage
    ).toHaveBeenCalledWith(1234, 99, { isRead: true });
    expect(result.content[0].text).toContain(
      "Sandbox message 99 marked as read"
    );
  });

  it("marks the message as unread", async () => {
    mockSandboxClient.testing.messages.updateMessage.mockResolvedValue({
      id: 99,
      is_read: false,
    });

    const result = await updateSandboxMessage({
      message_id: 99,
      is_read: false,
    });

    expect(result.content[0].text).toContain(
      "Sandbox message 99 marked as unread"
    );
  });

  it("handles failure", async () => {
    mockSandboxClient.testing.messages.updateMessage.mockRejectedValue(
      new Error("not found")
    );

    const result = await updateSandboxMessage({
      message_id: 99,
      is_read: true,
    });

    expect(result.isError).toBe(true);
  });
});
