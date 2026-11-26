import { DeleteTemplateRequest } from "../../types/mailtrap";
import { requireClient } from "../../client";
import { buildErrorResponse } from "../utils/responses";

async function deleteTemplate({
  template_id,
}: DeleteTemplateRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const mailtrap = requireClient("templates");

    await mailtrap.templates.delete(template_id);

    return {
      content: [
        {
          type: "text",
          text: `Template with ID ${template_id} deleted successfully!`,
        },
      ],
    };
  } catch (error) {
    return buildErrorResponse("delete template", error);
  }
}

export default deleteTemplate;
