import createTemplate from "../createTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    create: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("createTemplate", () => {
  const mockTemplate = {
    id: 99,
    uuid: "new-uuid",
    name: "Welcome",
    subject: "Hi",
    category: "Onboarding",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates a template with html and returns summary + JSON", async () => {
    mockClient.templates.create.mockResolvedValue(mockTemplate);

    const result = await createTemplate({
      name: "Welcome",
      subject: "Hi",
      html: "<p>Hi</p>",
      category: "Onboarding",
    });

    expect(mockClient.templates.create).toHaveBeenCalledWith({
      name: "Welcome",
      subject: "Hi",
      category: "Onboarding",
      body_html: "<p>Hi</p>",
    });
    expect(result.content[0].text).toContain('Template "Welcome" created.');
    expect(result.content[0].text).toContain('"id": 99');
    expect(result.content[0].text).toContain('"uuid": "new-uuid"');
    expect(result.isError).toBeUndefined();
  });

  it("creates a template with text-only body", async () => {
    mockClient.templates.create.mockResolvedValue(mockTemplate);

    await createTemplate({
      name: "Welcome",
      subject: "Hi",
      text: "Hi",
    });

    expect(mockClient.templates.create).toHaveBeenCalledWith({
      name: "Welcome",
      subject: "Hi",
      category: "General",
      body_text: "Hi",
    });
  });

  it("rejects when neither html nor text is provided", async () => {
    const result = await createTemplate({
      name: "Welcome",
      subject: "Hi",
    });

    expect(mockClient.templates.create).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "At least one of 'html' or 'text' content must be provided"
    );
  });

  it("surfaces API errors", async () => {
    mockClient.templates.create.mockRejectedValue(new Error("name taken"));

    const result = await createTemplate({
      name: "Dup",
      subject: "Hi",
      html: "<p>hi</p>",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe(
      "Failed to create template: name taken"
    );
  });
});
