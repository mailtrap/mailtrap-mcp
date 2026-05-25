import forwardSandboxMessage from "../forwardSandboxMessage";
import { getSandboxClient } from "../../../client";

const mockSandboxClient = {
  testing: {
    messages: {
      forward: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

describe("forwardSandboxMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, { MAILTRAP_SANDBOX_ID: "1234" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("forwards the message", async () => {
    mockSandboxClient.testing.messages.forward.mockResolvedValue({});

    const result = await forwardSandboxMessage({
      message_id: 99,
      email: "user@example.com",
    });

    expect(getSandboxClient).toHaveBeenCalledWith(1234);
    expect(mockSandboxClient.testing.messages.forward).toHaveBeenCalledWith(
      1234,
      99,
      "user@example.com"
    );
    expect(result.content[0].text).toContain(
      "Sandbox message 99 forwarded to user@example.com"
    );
  });

  it("uses explicit sandbox_id over env", async () => {
    mockSandboxClient.testing.messages.forward.mockResolvedValue({});

    await forwardSandboxMessage({
      sandbox_id: 555,
      message_id: 99,
      email: "a@b.com",
    });

    expect(getSandboxClient).toHaveBeenCalledWith(555);
  });

  it("errors when no sandbox id is available", async () => {
    delete process.env.MAILTRAP_SANDBOX_ID;
    const result = await forwardSandboxMessage({
      message_id: 99,
      email: "a@b.com",
    });

    expect(result.content[0].text).toContain(
      "Provide sandbox_id or set MAILTRAP_SANDBOX_ID"
    );
    expect(result.isError).toBe(true);
  });
});
