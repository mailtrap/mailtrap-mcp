import listTemplates from "../listTemplates";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(() => mockClient),
}));

describe("listTemplates", () => {
  const mockTemplates = [
    {
      id: 12345,
      uuid: "abc-def-ghi",
      name: "Welcome Email",
      subject: "Welcome to our platform!",
      category: "Onboarding",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 12346,
      uuid: "def-ghi-jkl",
      name: "Password Reset",
      subject: "Reset your password",
      category: "Security",
      created_at: "2024-01-20T14:45:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("returns templates as JSON", async () => {
    mockClient.templates.getList.mockResolvedValue(mockTemplates);

    const result = await listTemplates();

    expect(mockClient.templates.getList).toHaveBeenCalledWith();
    expect(result.content[0].text).toContain('"id": 12345');
    expect(result.content[0].text).toContain('"name": "Welcome Email"');
    expect(result.content[0].text).toContain('"id": 12346');
    expect(result.isError).toBeUndefined();
  });

  it("returns an empty array as JSON when no templates", async () => {
    mockClient.templates.getList.mockResolvedValue([]);

    const result = await listTemplates();

    expect(result.content[0].text).toBe("[]");
  });

  it("handles null response as empty array", async () => {
    mockClient.templates.getList.mockResolvedValue(null);

    const result = await listTemplates();

    expect(result.content[0].text).toBe("[]");
  });

  it("surfaces API errors", async () => {
    mockClient.templates.getList.mockRejectedValue(new Error("boom"));

    const result = await listTemplates();

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Failed to list templates: boom");
  });
});
