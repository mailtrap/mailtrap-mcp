import deleteTrackingOptOut from "../deleteTrackingOptOut";
import { requireClient } from "../../../client";

const mockClient = {
  trackingOptOuts: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteTrackingOptOut", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the tracking opt-out and reports the result", async () => {
    mockClient.trackingOptOuts.delete.mockResolvedValue({
      id: "abc-1",
      email: "alice@example.com",
      domain_name: "example.com",
      created_at: "2026-05-19T10:00:00Z",
    });

    const result = await deleteTrackingOptOut({
      tracking_opt_out_id: "abc-1",
    });

    expect(requireClient).toHaveBeenCalledWith("tracking opt-outs", {
      requireAccountId: false,
    });
    expect(mockClient.trackingOptOuts.delete).toHaveBeenCalledWith("abc-1");
    expect(result.content[0].text).toBe(
      "Tracking opt-out abc-1 (alice@example.com) deleted. Open and click tracking applies to this address again."
    );
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.trackingOptOuts.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteTrackingOptOut({
      tracking_opt_out_id: "missing",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete tracking opt-out: not found"
    );
  });
});
