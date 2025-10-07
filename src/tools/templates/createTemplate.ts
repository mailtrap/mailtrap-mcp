import { CreateTemplateRequest } from "../../types/mailtrap";
import { client } from "../../client";

async function createTemplate({
  name,
  subject,
  html,
  text,
  category,
}: CreateTemplateRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    // Validate that at least one of html or text is provided
    if (!html && !text) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to create template: At least one of 'html' or 'text' content must be provided.",
          },
        ],
        isError: true,
      };
    }

    const createParams: any = {
      name,
      subject,
      category: category || "General",
    };

    if (html) {
      createParams.body_html = html;
    }
    if (text) {
      createParams.body_text = text;
    }

    const template = await client.templates.create(createParams);

    return {
      content: [
        {
          type: "text",
          text: `Template "${name}" created successfully!\nTemplate ID: ${template.id}\nTemplate UUID: ${template.uuid}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error creating template:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to create template: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default createTemplate;
