import getInboundFolder from "../getInboundFolder";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    folders: {
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getInboundFolder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the folder as JSON", async () => {
    mockClient.inbound.folders.get.mockResolvedValue({
      id: 77,
      name: "Support",
    });

    const result = await getInboundFolder({ folder_id: 77 });

    expect(mockClient.inbound.folders.get).toHaveBeenCalledWith(77);
    expect(result.content[0].text).toContain('"id": 77');
    expect(result.content[0].text).toContain('"name": "Support"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await getInboundFolder({ folder_id: "nope" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.folders.get).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.folders.get.mockRejectedValue(new Error("boom"));

    const result = await getInboundFolder({ folder_id: 77 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get inbound folder: boom");
  });
});
