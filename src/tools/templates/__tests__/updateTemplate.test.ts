import updateTemplate from "../updateTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
}));

describe("updateTemplate", () => {
  const mockTemplateId = 12345;
  const mockUpdateData = {
    template_id: mockTemplateId,
    name: "Updated Template Name",
    subject: "Updated Email Subject",
    html: "<h1>Updated Template</h1><p>This is an updated template.</p>",
    text: "Updated Template\n\nThis is an updated template.",
    category: "Updated Category",
  };

  const mockResponse = {
    id: mockTemplateId,
    uuid: "abc-def-ghi",
    name: mockUpdateData.name,
    subject: mockUpdateData.subject,
    category: mockUpdateData.category,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
    mockClient.templates.update.mockResolvedValue(mockResponse);
  });

  it("should update template successfully with all fields", async () => {
    const result = await updateTemplate(mockUpdateData);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      name: mockUpdateData.name,
      subject: mockUpdateData.subject,
      body_html: mockUpdateData.html,
      body_text: mockUpdateData.text,
      category: mockUpdateData.category,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockUpdateData.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template successfully with only name", async () => {
    const updateDataWithOnlyName = {
      template_id: mockTemplateId,
      name: "New Template Name",
    };

    const result = await updateTemplate(updateDataWithOnlyName);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      name: "New Template Name",
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template successfully with only subject", async () => {
    const updateDataWithOnlySubject = {
      template_id: mockTemplateId,
      subject: "New Email Subject",
    };

    const result = await updateTemplate(updateDataWithOnlySubject);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      subject: "New Email Subject",
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template successfully with only html", async () => {
    const updateDataWithOnlyHtml = {
      template_id: mockTemplateId,
      html: "<h1>New HTML Content</h1>",
    };

    const result = await updateTemplate(updateDataWithOnlyHtml);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      body_html: "<h1>New HTML Content</h1>",
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template successfully with only text", async () => {
    const updateDataWithOnlyText = {
      template_id: mockTemplateId,
      text: "New text content",
    };

    const result = await updateTemplate(updateDataWithOnlyText);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      body_text: "New text content",
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template successfully with only category", async () => {
    const updateDataWithOnlyCategory = {
      template_id: mockTemplateId,
      category: "New Category",
    };

    const result = await updateTemplate(updateDataWithOnlyCategory);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      category: "New Category",
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template successfully with multiple fields", async () => {
    const updateDataWithMultipleFields = {
      template_id: mockTemplateId,
      name: "Updated Name",
      subject: "Updated Subject",
      category: "Updated Category",
    };

    const result = await updateTemplate(updateDataWithMultipleFields);

    expect(mockClient.templates.update).toHaveBeenCalledWith(mockTemplateId, {
      name: "Updated Name",
      subject: "Updated Subject",
      category: "Updated Category",
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should update template with different template ID", async () => {
    const differentTemplateId = 67890;
    const updateDataWithDifferentId = {
      template_id: differentTemplateId,
      name: "Different Template",
    };

    const result = await updateTemplate(updateDataWithDifferentId);

    expect(mockClient.templates.update).toHaveBeenCalledWith(
      differentTemplateId,
      {
        name: "Different Template",
      }
    );

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockResponse.name}" updated successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should reject update with no fields provided", async () => {
    const updateDataWithNoFields = {
      template_id: mockTemplateId,
    };

    const result = await updateTemplate(updateDataWithNoFields);

    expect(mockClient.templates.update).not.toHaveBeenCalled();

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "Error: At least one update field (name, subject, html, text, or category) must be provided",
        },
      ],
      isError: true,
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

    it("should handle client.templates.update failure", async () => {
      const mockError = new Error("Failed to update template");
      mockClient.templates.update.mockRejectedValue(mockError);

      const result = await updateTemplate(mockUpdateData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to update template: Failed to update template",
          },
        ],
        isError: true,
      });
    });

    it("should handle non-Error exceptions", async () => {
      const mockError = "String error";
      mockClient.templates.update.mockRejectedValue(mockError);

      const result = await updateTemplate(mockUpdateData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to update template: String error",
          },
        ],
        isError: true,
      });
    });

    it("should handle template not found error", async () => {
      const mockError = new Error("Template not found");
      mockClient.templates.update.mockRejectedValue(mockError);

      const result = await updateTemplate(mockUpdateData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to update template: Template not found",
          },
        ],
        isError: true,
      });
    });

    it("should handle validation error", async () => {
      const mockError = new Error("Validation failed");
      mockClient.templates.update.mockRejectedValue(mockError);

      const result = await updateTemplate(mockUpdateData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating template:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to update template: Validation failed",
          },
        ],
        isError: true,
      });
    });
  });
});
