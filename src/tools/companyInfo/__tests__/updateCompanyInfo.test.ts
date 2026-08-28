import updateCompanyInfo from "../updateCompanyInfo";
import { requireClient } from "../../../client";

const mockClient = {
  companyInfo: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateCompanyInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("sends only the fields provided", async () => {
    mockClient.companyInfo.update.mockResolvedValue({
      data: { city: "New York", zip_code: "10001" },
    });

    const result = await updateCompanyInfo({
      sending_domain_id: 4321,
      city: "New York",
      zip_code: "10001",
    });

    expect(requireClient).toHaveBeenCalledWith("company info", {
      requireAccountId: false,
    });
    expect(mockClient.companyInfo.update).toHaveBeenCalledWith(4321, {
      city: "New York",
      zip_code: "10001",
    });
    expect(JSON.parse(result.content[0].text).city).toBe("New York");
    expect(result.isError).toBeUndefined();
  });

  it("rejects an update with no fields", async () => {
    const result = await updateCompanyInfo({ sending_domain_id: 4321 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Provide at least one field to update."
    );
    expect(mockClient.companyInfo.update).not.toHaveBeenCalled();
  });

  it("rejects unknown properties", async () => {
    const result = await updateCompanyInfo({
      sending_domain_id: 4321,
      company_name: "Mailtrap",
    });

    expect(result.isError).toBe(true);
    expect(mockClient.companyInfo.update).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.companyInfo.update.mockRejectedValue(new Error("not found"));

    const result = await updateCompanyInfo({
      sending_domain_id: 4321,
      city: "New York",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update company info: not found"
    );
  });
});
