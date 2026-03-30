import deleteSendingDomain from "../deleteSendingDomain";
import { requireClient } from "../../../client";

const mockClient = {
  sendingDomains: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("deleteSendingDomain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.sendingDomains.delete.mockResolvedValue(undefined);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should delete sending domain successfully", async () => {
    const result = await deleteSendingDomain({ sending_domain_id: 3938 });

    expect(mockClient.sendingDomains.delete).toHaveBeenCalledWith(3938);
    expect(result.content[0].text).toContain("deleted successfully");
    expect(result.content[0].text).toContain("3938");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending domains"
      );
    });

    const result = await deleteSendingDomain({ sending_domain_id: 3938 });

    expect(mockClient.sendingDomains.delete).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.sendingDomains.delete.mockRejectedValue(new Error("Not found"));

    const result = await deleteSendingDomain({ sending_domain_id: 999 });

    expect(result.content[0].text).toContain("Failed to delete sending domain");
    expect(result.isError).toBe(true);
  });
});
