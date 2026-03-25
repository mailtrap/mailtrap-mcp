import createSendingDomain from "../createSendingDomain";
import { requireClient } from "../../../client";

const mockClient = {
  sendingDomains: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("createSendingDomain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.sendingDomains.create.mockResolvedValue({
      id: 3938,
      domain_name: "example.com",
      dns_records: [
        {
          key: "verification",
          type: "CNAME",
          name: "verify123",
          value: "smtp.mailtrap.live",
          status: "pending",
        },
      ],
    });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should create sending domain successfully and show DNS setup instructions", async () => {
    const result = await createSendingDomain({ domain_name: "example.com" });

    expect(mockClient.sendingDomains.create).toHaveBeenCalledWith({
      domain_name: "example.com",
    });
    expect(result.content[0].text).toContain("example.com");
    expect(result.content[0].text).toContain("created successfully");
    expect(result.content[0].text).toContain("3938");
    expect(result.content[0].text).toContain("Add DNS records for example.com");
    expect(result.content[0].text).toContain("DNS records to add:");
    expect(result.content[0].text).toContain("verification");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending domains"
      );
    });

    const result = await createSendingDomain({ domain_name: "example.com" });

    expect(mockClient.sendingDomains.create).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.sendingDomains.create.mockRejectedValue(
      new Error("Domain already exists")
    );

    const result = await createSendingDomain({ domain_name: "example.com" });

    expect(result.content[0].text).toEqual(
      "Failed to create sending domain: Domain already exists"
    );
    expect(result.isError).toBe(true);
  });
});
