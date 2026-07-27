import listInboundThreads from "../listInboundThreads";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    threads: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listInboundThreads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns a formatted summary with a next-page hint", async () => {
    mockClient.inbound.threads.getList.mockResolvedValue({
      data: [
        {
          id: "t1",
          subject: "Billing question",
          messages_count: 3,
          last_message_at: "2026-01-15T10:30:00Z",
        },
      ],
      total_count: 12,
      last_id: "t1",
    });

    const result = await listInboundThreads({ inbox_id: 473 });

    expect(mockClient.inbound.threads.getList).toHaveBeenCalledWith(
      473,
      undefined
    );
    expect(result.content[0].text).toContain("Found 1 thread(s) of 12 total");
    expect(result.content[0].text).toContain('Next page: pass last_id: "t1"');
    expect(result.isError).toBeUndefined();
  });

  it("passes the pagination cursor", async () => {
    mockClient.inbound.threads.getList.mockResolvedValue({
      data: [],
      total_count: 0,
      last_id: null,
    });

    await listInboundThreads({ inbox_id: 473, last_id: "t0" });

    expect(mockClient.inbound.threads.getList).toHaveBeenCalledWith(473, {
      last_id: "t0",
    });
  });

  it("returns the empty message when no threads exist", async () => {
    mockClient.inbound.threads.getList.mockResolvedValue({
      data: [],
      total_count: 0,
      last_id: null,
    });

    const result = await listInboundThreads({ inbox_id: 473 });

    expect(result.content[0].text).toBe("No threads found in this inbox.");
  });

  it("rejects invalid input", async () => {
    const result = await listInboundThreads({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.threads.getList).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.threads.getList.mockRejectedValue(new Error("boom"));

    const result = await listInboundThreads({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list inbound threads: boom");
  });
});
