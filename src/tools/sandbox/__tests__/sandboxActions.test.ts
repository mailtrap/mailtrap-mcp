import markSandboxAsRead from "../markSandboxAsRead";
import resetSandboxCredentials from "../resetSandboxCredentials";
import enableSandboxEmailAddress from "../enableSandboxEmailAddress";
import resetSandboxEmailAddress from "../resetSandboxEmailAddress";
import { requireClient } from "../../../client";

const mockClient = {
  testing: {
    inboxes: {
      markAsRead: jest.fn(),
      resetCredentials: jest.fn(),
      enableEmailAddress: jest.fn(),
      resetEmailAddress: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("sandbox single-action tools", () => {
  const sandboxId = 555;

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  describe("markSandboxAsRead", () => {
    it("marks sandbox as read", async () => {
      mockClient.testing.inboxes.markAsRead.mockResolvedValue({
        id: sandboxId,
        name: "Test",
      });

      const result = await markSandboxAsRead({ sandbox_id: sandboxId });

      expect(mockClient.testing.inboxes.markAsRead).toHaveBeenCalledWith(
        sandboxId
      );
      expect(result.content[0].text).toContain(
        `Marked all messages in sandbox "Test"`
      );
      expect(result.isError).toBeUndefined();
    });

    it("handles failure", async () => {
      mockClient.testing.inboxes.markAsRead.mockRejectedValue(
        new Error("not found")
      );
      const result = await markSandboxAsRead({ sandbox_id: sandboxId });
      expect(result.isError).toBe(true);
    });
  });

  describe("resetSandboxCredentials", () => {
    it("returns new credentials", async () => {
      mockClient.testing.inboxes.resetCredentials.mockResolvedValue({
        id: sandboxId,
        name: "Test",
        username: "u",
        password: "p",
      });

      const result = await resetSandboxCredentials({ sandbox_id: sandboxId });

      expect(mockClient.testing.inboxes.resetCredentials).toHaveBeenCalledWith(
        sandboxId
      );
      expect(result.content[0].text).toContain("Username: u");
      expect(result.content[0].text).toContain("Password: p");
    });
  });

  describe("enableSandboxEmailAddress", () => {
    it("returns the resolved address", async () => {
      mockClient.testing.inboxes.enableEmailAddress.mockResolvedValue({
        id: sandboxId,
        name: "Test",
        email_username: "u",
        email_domain: "d.com",
      });

      const result = await enableSandboxEmailAddress({ sandbox_id: sandboxId });

      expect(
        mockClient.testing.inboxes.enableEmailAddress
      ).toHaveBeenCalledWith(sandboxId);
      expect(result.content[0].text).toContain("Address: u@d.com");
    });
  });

  describe("resetSandboxEmailAddress", () => {
    it("returns the new address", async () => {
      mockClient.testing.inboxes.resetEmailAddress.mockResolvedValue({
        id: sandboxId,
        name: "Test",
        email_username: "new",
        email_domain: "d.com",
      });

      const result = await resetSandboxEmailAddress({ sandbox_id: sandboxId });

      expect(result.content[0].text).toContain("New address: new@d.com");
    });
  });
});
