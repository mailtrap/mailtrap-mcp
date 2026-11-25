import { CreateTemplateRequest } from "../../types/mailtrap";
import { requireClient } from "../../client";
import { buildErrorResponse } from "../utils/responses";

async function createTemplate({
  name,
  subject,
  html,
  text,
  category,
}: CreateTemplateRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const mailtrap = requireClient("templates");

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

    const { data: template } = await mailtrap.templates.create(createParams);

    return {
      content: [
        {
          type: "text",
          text: `Template "${name}" created successfully!\nTemplate ID: ${template.id}\nTemplate UUID: ${template.uuid}`,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("create template", error);
  }
}

export default createTemplate;
