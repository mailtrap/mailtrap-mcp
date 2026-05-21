import deleteTemplate from "../deleteTemplate";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    delete: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("deleteTemplate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("deletes the template and returns a confirmation", async () => {
    mockClient.templates.delete.mockResolvedValue(undefined);

    const result = await deleteTemplate({ template_id: 7 });

    expect(mockClient.templates.delete).toHaveBeenCalledWith(7);
    expect(result.content[0].text).toContain("Template 7 deleted");
    expect(result.content[0].text).toContain('"template_id": 7');
    expect(result.content[0].text).toContain('"deleted": true');
    expect(result.isError).toBeUndefined();
  });

  it("surfaces API errors", async () => {
    mockClient.templates.delete.mockRejectedValue(new Error("not found"));

    const result = await deleteTemplate({ template_id: 99 });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to delete template: not found");
  });
});
