import deleteSuppression from "../deleteSuppression";
import { requireClient } from "../../../client";

const mockClient = {
  suppressions: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteSuppression", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the suppression and reports the result", async () => {
    mockClient.suppressions.delete.mockResolvedValue({
      id: "abc-1",
      email: "alice@example.com",
      type: "hard bounce",
      sending_stream: "transactional",
      created_at: "2026-05-19T10:00:00Z",
    });

    const result = await deleteSuppression({ suppression_id: "abc-1" });

    expect(requireClient).toHaveBeenCalledWith("suppressions");
    expect(mockClient.suppressions.delete).toHaveBeenCalledWith("abc-1");
    expect(result.content[0].text).toBe(
      "Suppression abc-1 (alice@example.com, type: hard bounce) deleted."
    );
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.suppressions.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteSuppression({ suppression_id: "missing" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete suppression: not found"
    );
  });
});
