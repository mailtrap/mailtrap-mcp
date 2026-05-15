import { requireClient } from "../../client";
import { GetTemplateRequest } from "../../types/mailtrap";

async function getTemplate({
  template_id,
}: GetTemplateRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const mailtrap = requireClient("templates");

    const template = await mailtrap.templates.get(template_id);

    const lines = [
      `Template: ${template.name} (ID: ${template.id}, UUID: ${template.uuid})`,
      `Subject: ${template.subject}`,
      `Category: ${template.category}`,
      `Created: ${template.created_at}`,
      `Updated: ${template.updated_at}`,
      "",
      "HTML body:",
      template.body_html || "(none)",
    ];

    if (template.body_text) {
      lines.push("", "Text body:", template.body_text);
    }

    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  } catch (error) {
    console.error("Error getting template:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to get template: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getTemplate;
