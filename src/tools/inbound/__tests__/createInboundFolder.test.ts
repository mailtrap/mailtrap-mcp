import createInboundFolder from "../createInboundFolder";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    folders: {
      create: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createInboundFolder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a folder and returns it as JSON", async () => {
    mockClient.inbound.folders.create.mockResolvedValue({
      id: 77,
      name: "Support",
    });

    const result = await createInboundFolder({ name: "Support" });

    expect(mockClient.inbound.folders.create).toHaveBeenCalledWith({
      name: "Support",
    });
    expect(result.content[0].text).toContain('"name": "Support"');
    expect(result.isError).toBeUndefined();
  });

  it("rejects invalid input", async () => {
    const result = await createInboundFolder({ unsupported: "x" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input");
    expect(mockClient.inbound.folders.create).not.toHaveBeenCalled();
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.folders.create.mockRejectedValue(new Error("boom"));

    const result = await createInboundFolder({ name: "Support" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create inbound folder: boom"
    );
  });
});
