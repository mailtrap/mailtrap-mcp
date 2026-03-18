import deleteSendingDomain from "../deleteSendingDomain";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    sendingDomains: {
      delete: jest.fn(),
    },
  },
}));

const originalEnv = { ...process.env };

describe("deleteSendingDomain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, { MAILTRAP_ACCOUNT_ID: "12345" });
    (client.sendingDomains.delete as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("should delete sending domain successfully", async () => {
    const result = await deleteSendingDomain({ sending_domain_id: 3938 });

    expect(client.sendingDomains.delete).toHaveBeenCalledWith(3938);
    expect(result.content[0].text).toContain("deleted successfully");
    expect(result.content[0].text).toContain("3938");
    expect(result.isError).toBeUndefined();
  });

  it("should require MAILTRAP_ACCOUNT_ID", async () => {
    delete process.env.MAILTRAP_ACCOUNT_ID;

    const result = await deleteSendingDomain({ sending_domain_id: 3938 });

    expect(client.sendingDomains.delete).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
  });

  it("should handle API failure", async () => {
    (client.sendingDomains.delete as jest.Mock).mockRejectedValue(
      new Error("Not found")
    );

    const result = await deleteSendingDomain({ sending_domain_id: 999 });

    expect(result.content[0].text).toContain("Failed to delete sending domain");
    expect(result.isError).toBe(true);
  });
});
