import getCompanyInfo from "../getCompanyInfo";
import { requireClient } from "../../../client";

const mockClient = {
  companyInfo: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getCompanyInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the company info", async () => {
    const companyInfo = {
      name: "Mailtrap",
      address: "123 Main St",
      city: "San Francisco",
      country: "US",
      zip_code: "94105",
      website_url: "https://mailtrap.io",
      info_level: "business",
    };
    mockClient.companyInfo.get.mockResolvedValue({ data: companyInfo });

    const result = await getCompanyInfo({ sending_domain_id: 4321 });

    expect(requireClient).toHaveBeenCalledWith("company info", {
      requireAccountId: false,
    });
    expect(mockClient.companyInfo.get).toHaveBeenCalledWith(4321);
    expect(JSON.parse(result.content[0].text)).toEqual(companyInfo);
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.companyInfo.get.mockRejectedValue(new Error("not found"));

    const result = await getCompanyInfo({ sending_domain_id: 4321 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to get company info: not found"
    );
  });
});
