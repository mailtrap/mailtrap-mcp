import updateDomain from "../updateDomain";
import { requireClient } from "../../../client";

const mockClient = {
  domains: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

const updatedDomain = {
  id: 4321,
  domain_name: "example.com",
  open_tracking_enabled: true,
  click_tracking_enabled: true,
  tracking_opt_out_enabled: true,
  auto_unsubscribe_link_enabled: false,
  inbound_enabled: false,
};

describe("updateDomain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("sends only the settings provided and reports every setting back", async () => {
    mockClient.domains.update.mockResolvedValue(updatedDomain);

    const result = await updateDomain({
      domain_id: 4321,
      open_tracking_enabled: true,
      tracking_opt_out_enabled: true,
    });

    expect(requireClient).toHaveBeenCalledWith("domains");
    expect(mockClient.domains.update).toHaveBeenCalledWith(4321, {
      open_tracking_enabled: true,
      tracking_opt_out_enabled: true,
    });
    expect(result.content[0].text).toContain(
      "Domain example.com (ID: 4321) updated."
    );
    expect(result.content[0].text).toContain("Tracking opt-out link: true");
    expect(result.content[0].text).toContain("Auto unsubscribe link: false");
    expect(result.isError).toBeUndefined();
  });

  it("accepts the legacy sending_domain_id", async () => {
    mockClient.domains.update.mockResolvedValue(updatedDomain);

    const result = await updateDomain({
      sending_domain_id: 4321,
      inbound_enabled: false,
    });

    expect(mockClient.domains.update).toHaveBeenCalledWith(4321, {
      inbound_enabled: false,
    });
    expect(result.isError).toBeUndefined();
  });

  it("rejects a missing domain_id", async () => {
    const result = await updateDomain({ inbound_enabled: false });

    expect(mockClient.domains.update).not.toHaveBeenCalled();
    expect(result.content[0].text).toBe(
      "Failed to update domain: Provide domain_id"
    );
    expect(result.isError).toBe(true);
  });

  it("forwards a setting turned off", async () => {
    mockClient.domains.update.mockResolvedValue(updatedDomain);

    await updateDomain({
      domain_id: 4321,
      click_tracking_enabled: false,
    });

    expect(mockClient.domains.update).toHaveBeenCalledWith(4321, {
      click_tracking_enabled: false,
    });
  });

  it("rejects an update with no settings", async () => {
    const result = await updateDomain({ domain_id: 4321 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Provide at least one setting to update."
    );
    expect(mockClient.domains.update).not.toHaveBeenCalled();
  });

  it("rejects unknown properties", async () => {
    const result = await updateDomain({
      domain_id: 4321,
      open_tracking: true,
    });

    expect(result.isError).toBe(true);
    expect(mockClient.domains.update).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.domains.update.mockRejectedValue(new Error("not found"));

    const result = await updateDomain({
      domain_id: 4321,
      inbound_enabled: true,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to update domain: not found");
  });
});
