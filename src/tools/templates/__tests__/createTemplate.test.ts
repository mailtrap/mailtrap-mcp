import createTemplate from "../createTemplate";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    templates: {
      create: jest.fn(),
    },
  },
}));

describe("createTemplate", () => {
  const mockTemplateData = {
    name: "Test Template",
    subject: "Test Email Subject",
    html: "<h1>Test Template</h1><p>This is a test template.</p>",
    text: "Test Template\n\nThis is a test template.",
    category: "Test",
  };

  const mockResponse = {
    id: 12345,
    uuid: "abc-def-ghi",
    name: mockTemplateData.name,
    subject: mockTemplateData.subject,
    category: mockTemplateData.category,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (client.templates.create as jest.Mock).mockResolvedValue(mockResponse);
  });

  it("should create template successfully with all required fields", async () => {
    const result = await createTemplate(mockTemplateData);

    expect(client.templates.create).toHaveBeenCalledWith({
      name: mockTemplateData.name,
      subject: mockTemplateData.subject,
      category: mockTemplateData.category,
      body_html: mockTemplateData.html,
      body_text: mockTemplateData.text,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockTemplateData.name}" created successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should create template successfully with default category", async () => {
    const templateDataWithoutCategory = {
      name: mockTemplateData.name,
      subject: mockTemplateData.subject,
      html: mockTemplateData.html,
      text: mockTemplateData.text,
    };

    const result = await createTemplate(templateDataWithoutCategory);

    expect(client.templates.create).toHaveBeenCalledWith({
      name: mockTemplateData.name,
      subject: mockTemplateData.subject,
      category: "General",
      body_html: mockTemplateData.html,
      body_text: mockTemplateData.text,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockTemplateData.name}" created successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should create template successfully without text content", async () => {
    const templateDataWithoutText = {
      name: mockTemplateData.name,
      subject: mockTemplateData.subject,
      html: mockTemplateData.html,
      category: mockTemplateData.category,
    };

    const result = await createTemplate(templateDataWithoutText);

    expect(client.templates.create).toHaveBeenCalledWith({
      name: mockTemplateData.name,
      subject: mockTemplateData.subject,
      category: mockTemplateData.category,
      body_html: mockTemplateData.html,
      body_text: undefined,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockTemplateData.name}" created successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  it("should create template successfully with custom category", async () => {
    const customCategory = "Marketing";
    const templateDataWithCustomCategory = {
      ...mockTemplateData,
      category: customCategory,
    };

    const result = await createTemplate(templateDataWithCustomCategory);

    expect(client.templates.create).toHaveBeenCalledWith({
      name: mockTemplateData.name,
      subject: mockTemplateData.subject,
      category: customCategory,
      body_html: mockTemplateData.html,
      body_text: mockTemplateData.text,
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: `Template "${mockTemplateData.name}" created successfully!\nTemplate ID: ${mockResponse.id}\nTemplate UUID: ${mockResponse.uuid}`,
        },
      ],
    });
  });

  describe("error handling", () => {
    it("should handle client.templates.create failure", async () => {
      const mockError = new Error("Failed to create template");
      (client.templates.create as jest.Mock).mockRejectedValue(mockError);

      const result = await createTemplate(mockTemplateData);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to create template: Failed to create template",
          },
        ],
        isError: true,
      });
    });

    it("should handle non-Error exceptions", async () => {
      const mockError = "String error";
      (client.templates.create as jest.Mock).mockRejectedValue(mockError);

      const result = await createTemplate(mockTemplateData);

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to create template: String error",
          },
        ],
        isError: true,
      });
    });
  });
});
