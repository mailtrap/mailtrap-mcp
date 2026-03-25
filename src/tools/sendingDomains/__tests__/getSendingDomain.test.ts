import getSendingDomain from "../getSendingDomain";
import { requireClient } from "../../../client";

const mockClient = {
  sendingDomains: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const originalEnv = { ...process.env };

describe("getSendingDomain", () => {
  const mockDomain = {
    id: 3938,
    domain_name: "example.com",
    demo: false,
    compliance_status: "compliant",
    dns_verified: true,
    dns_verified_at: "2024-12-26T09:40:44.161Z",
    dns_records: [
      {
        key: "spf",
        type: "TXT",
        name: "",
        value: "v=spf1 include:_spf.smtp.mailtrap.live ~all",
        status: "pass",
        domain: "example.com",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.sendingDomains.get.mockResolvedValue(mockDomain);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should get sending domain successfully", async () => {
    const result = await getSendingDomain({ sending_domain_id: 3938 });

    expect(mockClient.sendingDomains.get).toHaveBeenCalledWith(3938);
    expect(result.content[0].text).toContain("example.com");
    expect(result.content[0].text).toContain("ID: 3938");
    expect(result.content[0].text).toContain("DNS verified: true");
    expect(result.content[0].text).toContain("spf");
    expect(result.content[0].text).toContain("pass");
    expect(result.isError).toBeUndefined();
  });

  it("should include setup instructions when include_setup_instructions is true", async () => {
    const result = await getSendingDomain({
      sending_domain_id: 3938,
      include_setup_instructions: true,
    });

    expect(mockClient.sendingDomains.get).toHaveBeenCalledWith(3938);
    expect(result.content[0].text).toContain("Domain: example.com");
    expect(result.content[0].text).toContain("Add DNS records for example.com");
    expect(result.content[0].text).toContain("What?");
    expect(result.content[0].text).toContain("Why?");
    expect(result.content[0].text).toContain("DNS records to add");
    expect(result.content[0].text).toContain("docs.mailtrap.io");
    expect(result.isError).toBeUndefined();
  });

  it("should not include setup instructions when include_setup_instructions is false or omitted", async () => {
    const result = await getSendingDomain({
      sending_domain_id: 3938,
      include_setup_instructions: false,
    });

    expect(result.content[0].text).not.toContain("Add DNS records for");
    expect(result.content[0].text).not.toContain("What?");
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;
    (requireClient as jest.Mock).mockImplementation(() => {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending domains"
      );
    });

    const result = await getSendingDomain({ sending_domain_id: 3938 });

    expect(mockClient.sendingDomains.get).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    mockClient.sendingDomains.get.mockRejectedValue(new Error("Not found"));

    const result = await getSendingDomain({ sending_domain_id: 999 });

    expect(result.content[0].text).toContain("Failed to get sending domain");
    expect(result.isError).toBe(true);
  });
});
