import createTrackingOptOut from "../createTrackingOptOut";
import { requireClient } from "../../../client";

const mockClient = {
  trackingOptOuts: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createTrackingOptOut", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates the tracking opt-out and reports the result", async () => {
    mockClient.trackingOptOuts.create.mockResolvedValue({
      data: {
        id: "abc-1",
        email: "alice@example.com",
        domain_name: "example.com",
        created_at: "2026-05-19T10:00:00Z",
      },
    });

    const result = await createTrackingOptOut({
      email: "alice@example.com",
      domain_id: 4321,
    });

    expect(requireClient).toHaveBeenCalledWith("tracking opt-outs", {
      requireAccountId: false,
    });
    expect(mockClient.trackingOptOuts.create).toHaveBeenCalledWith({
      email: "alice@example.com",
      domain_id: 4321,
    });
    expect(result.content[0].text).toBe(
      "Tracking opt-out created: alice@example.com (ID: abc-1, domain: example.com, created: 2026-05-19T10:00:00Z)."
    );
    expect(result.isError).toBeUndefined();
  });

  it("rejects a missing domain id", async () => {
    const result = await createTrackingOptOut({
      email: "alice@example.com",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("domain_id");
    expect(mockClient.trackingOptOuts.create).not.toHaveBeenCalled();
  });

  it("rejects a non-positive domain id", async () => {
    const result = await createTrackingOptOut({
      email: "alice@example.com",
      domain_id: 0,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("domain_id");
    expect(mockClient.trackingOptOuts.create).not.toHaveBeenCalled();
  });

  it("rejects unknown properties", async () => {
    const result = await createTrackingOptOut({
      email: "alice@example.com",
      domain_id: 4321,
      domain_name: "example.com",
    });

    expect(result.isError).toBe(true);
    expect(mockClient.trackingOptOuts.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.trackingOptOuts.create.mockRejectedValue(
      new Error("domain not found")
    );

    const result = await createTrackingOptOut({
      email: "alice@example.com",
      domain_id: 4321,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create tracking opt-out: domain not found"
    );
  });
});
