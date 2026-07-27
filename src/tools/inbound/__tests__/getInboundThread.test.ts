import getInboundThread from "../getInboundThread";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    threads: {
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getInboundThread", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the thread as JSON", async () => {
    mockClient.inbound.threads.get.mockResolvedValue({
      id: "t1",
      subject: "Billing question",
    });

    const result = await getInboundThread({ inbox_id: 473, thread_id: "t1" });

    expect(mockClient.inbound.threads.get).toHaveBeenCalledWith(473, "t1");
    expect(result.content[0].text).toContain('"id": "t1"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await getInboundThread({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.threads.get).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.threads.get.mockRejectedValue(new Error("boom"));

    const result = await getInboundThread({ inbox_id: 473, thread_id: "t1" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get inbound thread: boom");
  });
});
