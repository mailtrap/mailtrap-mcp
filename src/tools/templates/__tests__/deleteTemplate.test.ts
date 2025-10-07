import deleteTemplate from "../deleteTemplate";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    templates: {
      delete: jest.fn(),
    },
  },
}));

describe("deleteTemplate", () => {
  const mockTemplateId = 12345;

  beforeEach(() => {
    jest.clearAllMocks();
    (client.templates.delete as jest.Mock).mockResolvedValue(undefined);
  });

  it("should delete template successfully", async () => {
    const result = await deleteTemplate({ template_id: mockTemplateId });

    expect(client.templates.delete).toHaveBeenCalledWith(mockTemplateId);

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

    expect(client.templates.delete).toHaveBeenCalledWith(differentTemplateId);

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
    it("should handle client.templates.delete failure", async () => {
      const mockError = new Error("Failed to delete template");
      (client.templates.delete as jest.Mock).mockRejectedValue(mockError);

      const result = await deleteTemplate({ template_id: mockTemplateId });

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
      (client.templates.delete as jest.Mock).mockRejectedValue(mockError);

      const result = await deleteTemplate({ template_id: mockTemplateId });

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
      (client.templates.delete as jest.Mock).mockRejectedValue(mockError);

      const result = await deleteTemplate({ template_id: mockTemplateId });

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
