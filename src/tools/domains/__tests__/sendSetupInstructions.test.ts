import sendDomainSetupInstructions from "../sendSetupInstructions";
import { requireClient } from "../../../client";

const mockClient = {
  sendingDomains: {
    sendSetupInstructions: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("sendDomainSetupInstructions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.sendingDomains.sendSetupInstructions.mockResolvedValue(
      undefined
    );
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("sends setup instructions to the given email", async () => {
    const result = await sendDomainSetupInstructions({
      domain_id: 3938,
      email: "devops@example.com",
    });

    expect(
      mockClient.sendingDomains.sendSetupInstructions
    ).toHaveBeenCalledWith(3938, "devops@example.com");
    expect(result.content[0].text).toContain(
      "DNS setup instructions for domain 3938 sent to devops@example.com"
    );
    expect(result.isError).toBeUndefined();
  });

  it("accepts the legacy sending_domain_id", async () => {
    const result = await sendDomainSetupInstructions({
      sending_domain_id: 3938,
      email: "devops@example.com",
    });

    expect(
      mockClient.sendingDomains.sendSetupInstructions
    ).toHaveBeenCalledWith(3938, "devops@example.com");
    expect(result.isError).toBeUndefined();
  });

  it("requires MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for domains"
      );
    });

    const result = await sendDomainSetupInstructions({
      domain_id: 3938,
      email: "devops@example.com",
    });

    expect(
      mockClient.sendingDomains.sendSetupInstructions
    ).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it("handles API failure", async () => {
    mockClient.sendingDomains.sendSetupInstructions.mockRejectedValue(
      new Error("Invalid email")
    );

    const result = await sendDomainSetupInstructions({
      domain_id: 3938,
      email: "bad",
    });

    expect(result.content[0].text).toContain(
      "Failed to send domain setup instructions"
    );
    expect(result.content[0].text).toContain("Invalid email");
    expect(result.isError).toBe(true);
  });
});
