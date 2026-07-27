import deleteInboundThread from "../deleteInboundThread";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    threads: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteInboundThread", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes a thread and confirms", async () => {
    mockClient.inbound.threads.delete.mockResolvedValue(undefined);

    const result = await deleteInboundThread({
      inbox_id: 473,
      thread_id: "t1",
    });

    expect(mockClient.inbound.threads.delete).toHaveBeenCalledWith(473, "t1");
    expect(result.content[0].text).toBe(
      "Inbound thread t1 deleted successfully."
    );
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await deleteInboundThread({ inbox_id: 473 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.threads.delete).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.threads.delete.mockRejectedValue(new Error("boom"));

    const result = await deleteInboundThread({
      inbox_id: 473,
      thread_id: "t1",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete inbound thread: boom"
    );
  });
});
