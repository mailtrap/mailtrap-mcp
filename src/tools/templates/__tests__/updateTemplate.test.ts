import updateTemplate from "../updateTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    update: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("updateTemplate", () => {
  const mockTemplate = {
    id: 7,
    uuid: "new-uuid",
    name: "Renamed",
    subject: "Updated Subject",
    category: "Onboarding",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("updates a template and returns summary + JSON", async () => {
    mockClient.templates.update.mockResolvedValue(mockTemplate);

    const result = await updateTemplate({
      template_id: 7,
      name: "Renamed",
      subject: "Updated Subject",
      html: "<p>new</p>",
    });

    expect(mockClient.templates.update).toHaveBeenCalledWith(7, {
      name: "Renamed",
      subject: "Updated Subject",
      body_html: "<p>new</p>",
    });
    expect(result.content[0].text).toContain('Template "Renamed" updated.');
    expect(result.content[0].text).toContain('"id": 7');
    expect(result.isError).toBeUndefined();
  });

  it("translates html/text to body_html/body_text", async () => {
    mockClient.templates.update.mockResolvedValue(mockTemplate);

    await updateTemplate({
      template_id: 7,
      text: "Plain",
      category: "Marketing",
    });

    expect(mockClient.templates.update).toHaveBeenCalledWith(7, {
      body_text: "Plain",
      category: "Marketing",
    });
  });

  it("rejects when no update fields provided", async () => {
    const result = await updateTemplate({ template_id: 7 });

    expect(mockClient.templates.update).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("At least one update field");
  });

  it("rejects when both html and text are empty strings", async () => {
    const result = await updateTemplate({
      template_id: 7,
      html: "",
      text: "",
    });

    expect(mockClient.templates.update).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("at least one must have content");
  });

  it("surfaces API errors", async () => {
    mockClient.templates.update.mockRejectedValue(new Error("not found"));

    const result = await updateTemplate({ template_id: 99, name: "x" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to update template: not found");
  });
});
