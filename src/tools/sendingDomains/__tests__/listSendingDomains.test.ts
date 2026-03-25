import listSendingDomains from "../listSendingDomains";
import { requireClient } from "../../../client";

const mockClient = {
  sendingDomains: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("listSendingDomains", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should list sending domains successfully", async () => {
    const mockDomains = {
      data: [
        {
          id: 1,
          domain_name: "example.com",
          dns_verified: true,
          compliance_status: "compliant",
        },
        {
          id: 2,
          domain_name: "test.com",
          dns_verified: false,
          compliance_status: "pending",
        },
      ],
    };
    mockClient.sendingDomains.getList.mockResolvedValue(mockDomains);

    const result = await listSendingDomains();

    expect(mockClient.sendingDomains.getList).toHaveBeenCalledWith();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("example.com");
    expect(result.content[0].text).toContain("ID: 1");
    expect(result.content[0].text).toContain("test.com");
    expect(result.content[0].text).toContain("DNS verified: true");
    expect(result.content[0].text).toContain("DNS verified: false");
    expect(result.isError).toBeUndefined();
  });

  it("should handle empty domains list", async () => {
    mockClient.sendingDomains.getList.mockResolvedValue({
      data: [],
    });

    const result = await listSendingDomains();

    expect(result.content[0].text).toContain("No sending domains found");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending domains"
      );
    });

    const result = await listSendingDomains();

    expect(mockClient.sendingDomains.getList).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain("MAILTRAP_ACCOUNT_ID");
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.sendingDomains.getList.mockRejectedValue(
      new Error("Network error")
    );

    const result = await listSendingDomains();

    expect(result.content[0].text).toContain("Failed to list sending domains");
    expect(result.content[0].text).toContain("Network error");
    expect(result.isError).toBe(true);
  });
});
