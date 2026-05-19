import listSandboxAttachments from "../listSandboxAttachments";
import getSandboxAttachment from "../getSandboxAttachment";
import { getSandboxClient } from "../../../client";

const mockSandboxClient = {
  testing: {
    attachments: {
      getList: jest.fn(),
      get: jest.fn(),
    },
  },
};

jest.mock("../../../client", () => ({
  getSandboxClient: jest.fn(() => mockSandboxClient),
}));

const originalEnv = { ...process.env };

describe("sandbox attachment tools", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSandboxClient as jest.Mock).mockReturnValue(mockSandboxClient);
    Object.assign(process.env, { MAILTRAP_SANDBOX_ID: "1234" });
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  describe("listSandboxAttachments", () => {
    it("renders the attachment list", async () => {
      mockSandboxClient.testing.attachments.getList.mockResolvedValue([
        {
          id: 1,
          filename: "a.png",
          content_type: "image/png",
          attachment_size: 1024,
        },
        {
          id: 2,
          filename: "b.pdf",
          content_type: "application/pdf",
          attachment_size: 2048,
        },
      ]);

      const result = await listSandboxAttachments({ message_id: 99 });

      expect(
        mockSandboxClient.testing.attachments.getList
      ).toHaveBeenCalledWith(1234, 99);
      expect(result.content[0].text).toContain(
        "Attachments on sandbox message 99 (2)"
      );
      expect(result.content[0].text).toContain(
        "a.png (ID: 1, type: image/png, size: 1024 bytes)"
      );
    });

    it("handles empty list", async () => {
      mockSandboxClient.testing.attachments.getList.mockResolvedValue([]);

      const result = await listSandboxAttachments({ message_id: 99 });

      expect(result.content[0].text).toContain(
        "No attachments on sandbox message 99"
      );
    });
  });

  describe("getSandboxAttachment", () => {
    it("returns attachment metadata as JSON", async () => {
      mockSandboxClient.testing.attachments.get.mockResolvedValue({
        id: 1,
        filename: "a.png",
        download_path: "/api/.../1",
      });

      const result = await getSandboxAttachment({
        message_id: 99,
        attachment_id: 1,
      });

      expect(mockSandboxClient.testing.attachments.get).toHaveBeenCalledWith(
        1234,
        99,
        1
      );
      expect(result.content[0].text).toContain('"filename": "a.png"');
      expect(result.content[0].text).toContain('"download_path"');
    });

    it("handles failure", async () => {
      mockSandboxClient.testing.attachments.get.mockRejectedValue(
        new Error("not found")
      );

      const result = await getSandboxAttachment({
        message_id: 99,
        attachment_id: 1,
      });

      expect(result.isError).toBe(true);
    });
  });
});
