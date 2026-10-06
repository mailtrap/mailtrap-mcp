import getTemplate from "../getTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  emailTemplates: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
}));

describe("getTemplate", () => {
  const mockTemplateId = 12345;

  const mockTemplate = {
    id: mockTemplateId,
    uuid: "abcd-uuid",
    name: "Welcome",
    subject: "Welcome!",
    category: "General",
    body_html: "<h1>Welcome</h1>",
    body_text: "Welcome",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.emailTemplates.get.mockResolvedValue(mockTemplate);
  });

  it("returns template details", async () => {
    const result = await getTemplate({ template_id: mockTemplateId });

    expect(mockClient.emailTemplates.get).toHaveBeenCalledWith(mockTemplateId);
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      `Template: Welcome (ID: ${mockTemplateId}, UUID: abcd-uuid)`
    );
    expect(result.content[0].text).toContain("Subject: Welcome!");
    expect(result.content[0].text).toContain("HTML body:");
    expect(result.content[0].text).toContain("<h1>Welcome</h1>");
    expect(result.content[0].text).toContain("Text body:");
  });

  it("omits text body section when body_text is missing", async () => {
    mockClient.emailTemplates.get.mockResolvedValue({
      ...mockTemplate,
      body_text: undefined,
    });

    const result = await getTemplate({ template_id: mockTemplateId });

    expect(result.content[0].text).not.toContain("Text body:");
  });

  describe("error handling", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("handles API errors", async () => {
      const mockError = new Error("Not found");
      mockClient.emailTemplates.get.mockRejectedValue(mockError);

      const result = await getTemplate({ template_id: mockTemplateId });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to get template: Not found",
          },
        ],
        isError: true,
      });
    });

    it("handles non-Error exceptions", async () => {
      mockClient.emailTemplates.get.mockRejectedValue("Boom");

      const result = await getTemplate({ template_id: mockTemplateId });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to get template: Boom",
          },
        ],
        isError: true,
      });
    });
  });
});
