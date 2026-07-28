import listInboundFolders from "../listInboundFolders";
import { requireClient } from "../../../client";

const mockClient = {
  inbound: {
    folders: {
      getList: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listInboundFolders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns a formatted summary", async () => {
    mockClient.inbound.folders.getList.mockResolvedValue([
      { id: 77, name: "Support" },
      { id: 89, name: "Sales" },
    ]);

    const result = await listInboundFolders({});

    expect(requireClient).toHaveBeenCalledWith("inbound folders", {
      requireAccountId: false,
    });
    expect(result.content[0].text).toContain("Found 2 inbound folder(s)");
    expect(result.content[0].text).toContain("[77] Support");
    expect(result.isError).toBeUndefined();
  });

  it("returns the empty message when no folders exist", async () => {
    mockClient.inbound.folders.getList.mockResolvedValue([]);

    const result = await listInboundFolders({});

    expect(result.content[0].text).toBe(
      "No inbound folders in your Mailtrap account."
    );
  });

  it("surfaces API errors", async () => {
    mockClient.inbound.folders.getList.mockRejectedValue(new Error("boom"));

    const result = await listInboundFolders({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list inbound folders: boom");
  });
});
