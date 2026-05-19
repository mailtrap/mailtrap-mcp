import listSuppressions from "../listSuppressions";
import { requireClient } from "../../../client";

const mockClient = {
  suppressions: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listSuppressions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("renders the suppression list", async () => {
    mockClient.suppressions.getList.mockResolvedValue([
      {
        id: "abc-1",
        email: "alice@example.com",
        type: "hard bounce",
        sending_stream: "transactional",
        created_at: "2026-05-19T10:00:00Z",
      },
      {
        id: "def-2",
        email: "bob@example.com",
        type: "spam complaint",
        sending_stream: "bulk",
        created_at: "2026-05-19T11:00:00Z",
      },
    ]);

    const result = await listSuppressions();

    expect(requireClient).toHaveBeenCalledWith("suppressions");
    expect(mockClient.suppressions.getList).toHaveBeenCalledWith(undefined);
    expect(result.content[0].text).toContain("Suppressions (2):");
    expect(result.content[0].text).toContain(
      "alice@example.com (ID: abc-1, type: hard bounce, stream: transactional, created: 2026-05-19T10:00:00Z)"
    );
    expect(result.content[0].text).toContain(
      "bob@example.com (ID: def-2, type: spam complaint, stream: bulk, created: 2026-05-19T11:00:00Z)"
    );
    expect(result.isError).toBeUndefined();
  });

  it("passes the email filter through to the SDK", async () => {
    mockClient.suppressions.getList.mockResolvedValue([]);

    await listSuppressions({ email: "alice@example.com" });

    expect(mockClient.suppressions.getList).toHaveBeenCalledWith({
      email: "alice@example.com",
    });
  });

  it("returns a filter-specific message when nothing matches the email filter", async () => {
    mockClient.suppressions.getList.mockResolvedValue([]);

    const result = await listSuppressions({ email: "missing@example.com" });

    expect(result.content[0].text).toContain(
      'No suppressions found matching email "missing@example.com"'
    );
  });

  it("returns a generic empty message when no suppressions exist", async () => {
    mockClient.suppressions.getList.mockResolvedValue([]);

    const result = await listSuppressions();

    expect(result.content[0].text).toContain(
      "No suppressions in your Mailtrap account."
    );
  });

  it("handles a null response", async () => {
    mockClient.suppressions.getList.mockResolvedValue(null);

    const result = await listSuppressions();

    expect(result.content[0].text).toContain(
      "No suppressions in your Mailtrap account."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.suppressions.getList.mockRejectedValue(new Error("boom"));

    const result = await listSuppressions();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list suppressions: boom");
  });
});
