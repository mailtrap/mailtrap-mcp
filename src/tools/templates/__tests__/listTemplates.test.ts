import listTemplates from "../listTemplates";
import { requireClient } from "../../../client";

const mockClient = {
  templates: {
    getList: jest.fn(),
  },
};

jest.mock("../../../client", () => ({
  requireClient: jest.fn(),
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
    {
      id: 12347,
      uuid: "ghi-jkl-mno",
      name: "Newsletter Template",
      subject: "This week's updates",
      category: "Marketing",
      created_at: "2024-01-25T09:15:00Z",
    },
  ];

  const page = (
    data: typeof mockTemplates,
    nextToken: number | null = null
  ) => ({
    data,
    pagination: { token: 1, prev_token: null, next_token: nextToken },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (requireClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("should list templates successfully when templates exist", async () => {
    mockClient.templates.getList.mockResolvedValue(page(mockTemplates));

    const result = await listTemplates();

    expect(mockClient.templates.getList).toHaveBeenCalledWith({});

    const expectedText = `Found 3 template(s) on this page:

• Welcome Email (ID: 12345, UUID: abc-def-ghi)
  Subject: Welcome to our platform!
  Category: Onboarding
  Created: 2024-01-15T10:30:00Z

• Password Reset (ID: 12346, UUID: def-ghi-jkl)
  Subject: Reset your password
  Category: Security
  Created: 2024-01-20T14:45:00Z

• Newsletter Template (ID: 12347, UUID: ghi-jkl-mno)
  Subject: This week's updates
  Category: Marketing
  Created: 2024-01-25T09:15:00Z
`;

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: expectedText,
        },
      ],
    });
  });

  it("should handle empty templates list", async () => {
    mockClient.templates.getList.mockResolvedValue(page([]));

    const result = await listTemplates();

    expect(mockClient.templates.getList).toHaveBeenCalledWith({});

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "No templates found in your Mailtrap account.",
        },
      ],
    });
  });

  it("should handle null templates response", async () => {
    mockClient.templates.getList.mockResolvedValue(null);

    const result = await listTemplates();

    expect(mockClient.templates.getList).toHaveBeenCalledWith({});

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "No templates found in your Mailtrap account.",
        },
      ],
    });
  });

  it("should handle undefined templates response", async () => {
    mockClient.templates.getList.mockResolvedValue(undefined);

    const result = await listTemplates();

    expect(mockClient.templates.getList).toHaveBeenCalledWith({});

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "No templates found in your Mailtrap account.",
        },
      ],
    });
  });

  it("should handle single template", async () => {
    const singleTemplate = [mockTemplates[0]];
    mockClient.templates.getList.mockResolvedValue(page(singleTemplate));

    const result = await listTemplates();

    expect(mockClient.templates.getList).toHaveBeenCalledWith({});

    const expectedText = `Found 1 template(s) on this page:

• Welcome Email (ID: 12345, UUID: abc-def-ghi)
  Subject: Welcome to our platform!
  Category: Onboarding
  Created: 2024-01-15T10:30:00Z
`;

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: expectedText,
        },
      ],
    });
  });

  it("passes token and per_page, and names the next page", async () => {
    mockClient.templates.getList.mockResolvedValue(page([mockTemplates[0]], 3));

    const result = await listTemplates({ token: 2, per_page: 1 });

    expect(mockClient.templates.getList).toHaveBeenCalledWith({
      token: 2,
      per_page: 1,
    });
    expect(result.content[0].text).toContain(
      "Call list-templates with token 3 and per_page 1 for the next page."
    );
  });

  it("rejects per_page above 100 before any request", async () => {
    const result = await listTemplates({ per_page: 101 });

    expect(mockClient.templates.getList).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Invalid input: per_page");
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

    it("should handle client.templates.getList failure", async () => {
      const mockError = new Error("Failed to fetch templates");
      mockClient.templates.getList.mockRejectedValue(mockError);

      const result = await listTemplates();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error listing templates:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to list templates: Failed to fetch templates",
          },
        ],
        isError: true,
      });
    });

    it("should handle non-Error exceptions", async () => {
      const mockError = "String error";
      mockClient.templates.getList.mockRejectedValue(mockError);

      const result = await listTemplates();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error listing templates:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to list templates: String error",
          },
        ],
        isError: true,
      });
    });

    it("should handle network error", async () => {
      const mockError = new Error("Network error");
      mockClient.templates.getList.mockRejectedValue(mockError);

      const result = await listTemplates();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error listing templates:",
        mockError
      );
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Failed to list templates: Network error",
          },
        ],
        isError: true,
      });
    });
  });
});
