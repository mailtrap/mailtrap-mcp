import deleteInboundFolder from "../deleteInboundFolder";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    folders: {
      delete: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteInboundFolder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes a folder and confirms", async () => {
    mockClient.inbound.folders.delete.mockResolvedValue(undefined);

    const result = await deleteInboundFolder({ folder_id: 77 });

    expect(mockClient.inbound.folders.delete).toHaveBeenCalledWith(77);
    expect(result.content[0].text).toBe(
      "Inbound folder 77 deleted successfully."
    );
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await deleteInboundFolder({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.folders.delete).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.folders.delete.mockRejectedValue(new Error("boom"));

    const result = await deleteInboundFolder({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to delete inbound folder: boom"
    );
  });
});
