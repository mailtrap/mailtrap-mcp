import { requireClient } from "../../client";
import { listTemplatesZod } from "./schemas/listTemplates";

async function listTemplates(
  raw?: unknown
): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const parsed = listTemplatesZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const params = parsed.data;

    const mailtrap = requireClient("templates");

    const response = await mailtrap.templates.getList(params);
    const templates = response?.data ?? [];

    if (templates.length === 0) {
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

    const nextToken = response.pagination?.next_token;
    const nextPage =
      nextToken != null
        ? `\n\nMore templates exist. Call list-templates with token ${nextToken}${
            params.per_page ? ` and per_page ${params.per_page}` : ""
          } for the next page.`
        : "";

    return {
      content: [
        {
          type: "text",
          text: `Found ${templates.length} template(s) on this page:\n\n${templateList}${nextPage}`,
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
