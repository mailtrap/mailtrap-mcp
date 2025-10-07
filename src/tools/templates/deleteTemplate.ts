import { DeleteTemplateRequest } from "../../types/mailtrap";
import { client } from "../../client";

async function deleteTemplate({
  template_id,
}: DeleteTemplateRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    await client.templates.delete(template_id);

    return {
      content: [
        {
          type: "text",
          text: `Template with ID ${template_id} deleted successfully!`,
        },
      ],
    };
  } catch (error) {
    console.error("Error deleting template:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to delete template: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default deleteTemplate;
