import { client } from "../../client";

async function listTemplates(): Promise<{ content: any[]; isError?: boolean }> {
  try {
    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    const templates = await client.templates.getList();

    if (!templates || templates.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No templates found in your Mailtrap account.",
          },
        ],
      };
    }

    const templateList = templates
      .map(
        (template) =>
          `• ${template.name} (ID: ${template.id}, UUID: ${template.uuid})\n  Subject: ${template.subject}\n  Category: ${template.category}\n  Created: ${template.created_at}\n`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${templates.length} template(s):\n\n${templateList}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error listing templates:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to list templates: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default listTemplates;
