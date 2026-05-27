import { getOrganizationClient } from "../client";

describe("getOrganizationClient", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.MAILTRAP_ORGANIZATION_API_TOKEN = "test-token";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns a client when organization ID is a positive integer", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "42";

    expect(() => getOrganizationClient()).not.toThrow();
  });

  it("rejects a missing organization ID", () => {
    delete process.env.MAILTRAP_ORGANIZATION_ID;

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a non-numeric organization ID", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "not-a-number";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects zero", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "0";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a decimal organization ID", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "1.5";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a negative organization ID", () => {
    process.env.MAILTRAP_ORGANIZATION_ID = "-1";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_ID environment variable is required/
    );
  });

  it("rejects a missing organization API token", () => {
    delete process.env.MAILTRAP_ORGANIZATION_API_TOKEN;
    process.env.MAILTRAP_ORGANIZATION_ID = "42";

    expect(() => getOrganizationClient()).toThrow(
      /MAILTRAP_ORGANIZATION_API_TOKEN environment variable is required/
    );
  });
});
