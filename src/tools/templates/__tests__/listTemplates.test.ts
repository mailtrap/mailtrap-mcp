import listTemplates from "../listTemplates";
import { client } from "../../../client";

jest.mock("../../../client", () => ({
  client: {
    templates: {
      getList: jest.fn(),
    },
  },
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list templates successfully when templates exist", async () => {
    (client.templates.getList as jest.Mock).mockResolvedValue(mockTemplates);

    const result = await listTemplates();

    expect(client.templates.getList).toHaveBeenCalledWith();

    const expectedText = `Found 3 template(s):

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
    (client.templates.getList as jest.Mock).mockResolvedValue([]);

    const result = await listTemplates();

    expect(client.templates.getList).toHaveBeenCalledWith();

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
    (client.templates.getList as jest.Mock).mockResolvedValue(null);

    const result = await listTemplates();

    expect(client.templates.getList).toHaveBeenCalledWith();

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
    (client.templates.getList as jest.Mock).mockResolvedValue(undefined);

    const result = await listTemplates();

    expect(client.templates.getList).toHaveBeenCalledWith();

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
    (client.templates.getList as jest.Mock).mockResolvedValue(singleTemplate);

    const result = await listTemplates();

    expect(client.templates.getList).toHaveBeenCalledWith();

    const expectedText = `Found 1 template(s):

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

  describe("error handling", () => {
    it("should handle client.templates.getList failure", async () => {
      const mockError = new Error("Failed to fetch templates");
      (client.templates.getList as jest.Mock).mockRejectedValue(mockError);

      const result = await listTemplates();

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
      (client.templates.getList as jest.Mock).mockRejectedValue(mockError);

      const result = await listTemplates();

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
      (client.templates.getList as jest.Mock).mockRejectedValue(mockError);

      const result = await listTemplates();

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
