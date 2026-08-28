import createCompanyInfo from "../createCompanyInfo";
import { requireClient } from "../../../client";

const mockClient = {
  companyInfo: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const requiredParams = {
  name: "Mailtrap",
  address: "123 Main St",
  city: "San Francisco",
  country: "US",
  zip_code: "94105",
  website_url: "https://mailtrap.io",
};

describe("createCompanyInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates the company info without the domain id in the body", async () => {
    mockClient.companyInfo.create.mockResolvedValue({
      data: { ...requiredParams, info_level: "business" },
    });

    const result = await createCompanyInfo({
      sending_domain_id: 4321,
      ...requiredParams,
    });

    expect(requireClient).toHaveBeenCalledWith("company info", {
      requireAccountId: false,
    });
    expect(mockClient.companyInfo.create).toHaveBeenCalledWith(
      4321,
      requiredParams
    );
    expect(JSON.parse(result.content[0].text).name).toBe("Mailtrap");
    expect(result.isError).toBeUndefined();
  });

  it("forwards the optional fields", async () => {
    mockClient.companyInfo.create.mockResolvedValue({ data: requiredParams });

    await createCompanyInfo({
      sending_domain_id: 4321,
      ...requiredParams,
      phone: "+1 555 0100",
      privacy_policy_url: "https://mailtrap.io/privacy",
      terms_of_service_url: "https://mailtrap.io/terms",
      info_level: "individual",
    });

    expect(mockClient.companyInfo.create).toHaveBeenCalledWith(4321, {
      ...requiredParams,
      phone: "+1 555 0100",
      privacy_policy_url: "https://mailtrap.io/privacy",
      terms_of_service_url: "https://mailtrap.io/terms",
      info_level: "individual",
    });
  });

  it("rejects a missing required field", async () => {
    const withoutCity = { ...requiredParams };
    delete (withoutCity as Partial<typeof requiredParams>).city;

    const result = await createCompanyInfo({
      sending_domain_id: 4321,
      ...withoutCity,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("city");
    expect(mockClient.companyInfo.create).not.toHaveBeenCalled();
  });

  it("rejects an unknown info level", async () => {
    const result = await createCompanyInfo({
      sending_domain_id: 4321,
      ...requiredParams,
      info_level: "enterprise",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("info_level");
    expect(mockClient.companyInfo.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.companyInfo.create.mockRejectedValue(
      new Error("already exists")
    );

    const result = await createCompanyInfo({
      sending_domain_id: 4321,
      ...requiredParams,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create company info: already exists"
    );
  });
});
