import getTemplate from "../getTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    get: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("getTemplate", () => {
  const mockTemplate = {
    id: 12345,
    uuid: "abc-def-ghi",
    name: "Welcome Email",
    subject: "Welcome to our platform!",
    category: "Onboarding",
    body_html: "<p>Hello</p>",
    body_text: "Hello",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns the template as JSON", async () => {
    mockClient.templates.get.mockResolvedValue(mockTemplate);

    const result = await getTemplate({ template_id: 12345 });

    expect(mockClient.templates.get).toHaveBeenCalledWith(12345);
    expect(result.content[0].text).toContain('"id": 12345');
    expect(result.content[0].text).toContain('"name": "Welcome Email"');
    expect(result.content[0].text).toContain('"body_html"');
    expect(result.content[0].text).toContain('"body_text"');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.templates.get.mockRejectedValue(new Error("not found"));

    const result = await getTemplate({ template_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to get template: not found");
  });
});
