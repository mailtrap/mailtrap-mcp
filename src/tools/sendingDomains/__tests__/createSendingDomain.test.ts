import createSendingDomain from "../createSendingDomain";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    sendingDomains: {
      create: jest.fn(),
    },
  },
}));

const originalEnv = { ...process.env };

describe("createSendingDomain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (client.sendingDomains.create as jest.Mock).mockResolvedValue({
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

    expect(client.sendingDomains.create).toHaveBeenCalledWith({
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

    const result = await createSendingDomain({ domain_name: "example.com" });

    expect(client.sendingDomains.create).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    (client.sendingDomains.create as jest.Mock).mockRejectedValue(
      new Error("Domain already exists")
    );

    const result = await createSendingDomain({ domain_name: "example.com" });

    expect(result.content[0].text).toContain("Failed to create sending domain");
    expect(result.isError).toBe(true);
  });
});
