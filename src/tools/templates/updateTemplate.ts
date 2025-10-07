import { UpdateTemplateRequest } from "../../types/mailtrap";
import { client } from "../../client";

async function updateTemplate({
  template_id,
  name,
  subject,
  html,
  text,
  category,
}: UpdateTemplateRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    // Validate that at least one update field is provided
    if (
      name === undefined &&
      subject === undefined &&
      html === undefined &&
      text === undefined &&
      category === undefined
    ) {
      return {
        content: [
          {
            type: "text",
            text: "Error: At least one update field (name, subject, html, text, or category) must be provided",
          },
        ],
        isError: true,
      };
    }

    // Validate that if both html and text are being updated, at least one has content
    if (html !== undefined && text !== undefined && !html && !text) {
      return {
        content: [
          {
            type: "text",
            text: "Error: If updating both html and text, at least one must have content",
          },
        ],
        isError: true,
      };
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (subject !== undefined) updateData.subject = subject;
    if (html !== undefined) updateData.body_html = html;
    if (text !== undefined) updateData.body_text = text;
    if (category !== undefined) updateData.category = category;

    const template = await client.templates.update(template_id, updateData);

    return {
      content: [
        {
          type: "text",
          text: `Template "${template.name}" updated successfully!\nTemplate ID: ${template.id}\nTemplate UUID: ${template.uuid}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error updating template:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to update template: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default updateTemplate;
