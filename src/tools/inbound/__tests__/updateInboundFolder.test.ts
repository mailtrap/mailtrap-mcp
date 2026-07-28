import updateInboundFolder from "../updateInboundFolder";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    folders: {
      update: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateInboundFolder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates a folder and returns it as JSON", async () => {
    mockClient.inbound.folders.update.mockResolvedValue({
      id: 77,
      name: "Customer Success",
    });

    const result = await updateInboundFolder({
      folder_id: 77,
      name: "Customer Success",
    });

    expect(mockClient.inbound.folders.update).toHaveBeenCalledWith(77, {
      name: "Customer Success",
    });
    expect(result.content[0].text).toContain('"name": "Customer Success"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await updateInboundFolder({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.folders.update).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.folders.update.mockRejectedValue(new Error("boom"));

    const result = await updateInboundFolder({ folder_id: 77, name: "X" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to update inbound folder: boom"
    );
  });
});
