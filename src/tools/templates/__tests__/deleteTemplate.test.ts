import deleteTemplate from "../deleteTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
}));

describe("deleteTemplate", () => {
  const mockTemplateId = 12345;

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.templates.delete.mockResolvedValue(undefined);
  });

  it("should delete template successfully", async () => {
    const result = await deleteTemplate({ template_id: mockTemplateId });

    expect(mockClient.templates.delete).toHaveBeenCalledWith(mockTemplateId);

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template with ID ${mockTemplateId} deleted successfully!`,
        },
      ],
    });
  });

  it("should delete template with different ID", async () => {
    const differentTemplateId = 67890;
    const result = await deleteTemplate({ template_id: differentTemplateId });

    expect(mockClient.templates.delete).toHaveBeenCalledWith(
      differentTemplateId
    );

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template with ID ${differentTemplateId} deleted successfully!`,
        },
      ],
    });
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

    it("should handle client.templates.delete failure", async () => {
      const mockError = new Error("Failed to delete template");
      mockClient.templates.delete.mockRejectedValue(mockError);

      const result = await deleteTemplate({ template_id: mockTemplateId });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to delete template: Failed to delete template",
          },
        ],
        isError: true,
      });
    });

    it("should handle non-Error exceptions", async () => {
      const mockError = "String error";
      mockClient.templates.delete.mockRejectedValue(mockError);

      const result = await deleteTemplate({ template_id: mockTemplateId });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to delete template: String error",
          },
        ],
        isError: true,
      });
    });

    it("should handle template not found error", async () => {
      const mockError = new Error("Template not found");
      mockClient.templates.delete.mockRejectedValue(mockError);

      const result = await deleteTemplate({ template_id: mockTemplateId });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to delete template: Template not found",
          },
        ],
        isError: true,
      });
    });
  });
});
