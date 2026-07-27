import listInboundMessages from "../listInboundMessages";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    messages: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listInboundMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns a formatted summary with a next-page hint", async () => {
    mockClient.inbound.messages.getList.mockResolvedValue({
      data: [
        {
          id: "m1",
          from: "customer@example.com",
          subject: "Re: Question",
          received_at: "2026-01-15T10:30:00Z",
          attachments: [{ attachment_id: "a1" }],
        },
      ],
      total_count: 42,
      last_id: "m1",
    });

    const result = await listInboundMessages({ inbox_id: 473 });

    expect(mockClient.inbound.messages.getList).toHaveBeenCalledWith(
      473,
      undefined
    );
    expect(result.content[0].text).toContain("Found 1 message(s) of 42 total");
    expect(result.content[0].text).toContain(
      'from customer@example.com — "Re: Question"'
    );
    expect(result.content[0].text).toContain('Next page: pass last_id: "m1"');
    expect(result.isError).toBeUndefined();
  });

  it("passes the pagination cursor", async () => {
    mockClient.inbound.messages.getList.mockResolvedValue({
      data: [],
      total_count: 0,
      last_id: null,
    });

    await listInboundMessages({ inbox_id: 473, last_id: "m0" });

    expect(mockClient.inbound.messages.getList).toHaveBeenCalledWith(473, {
      last_id: "m0",
    });
  });

  it("returns the empty message when no messages exist", async () => {
    mockClient.inbound.messages.getList.mockResolvedValue({
      data: [],
      total_count: 0,
      last_id: null,
    });

    const result = await listInboundMessages({ inbox_id: 473 });

    expect(result.content[0].text).toBe("No messages found in this inbox.");
  });

  it("rejects invalid input", async () => {
    const result = await listInboundMessages({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.messages.getList).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.messages.getList.mockRejectedValue(new Error("boom"));

    const result = await listInboundMessages({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to list inbound messages: boom"
    );
  });
});
