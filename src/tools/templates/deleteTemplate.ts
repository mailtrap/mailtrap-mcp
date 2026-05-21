import { DeleteTemplateRequest } from "../../types/mailtrap";
import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteTemplate({
  template_id,
}: DeleteTemplateRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("templates");

    await mailtrap.templates.delete(template_id);

    return buildSuccessResponse(
      `Template ${template_id} deleted.\n\n${JSON.stringify(
        { template_id, deleted: true },
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("delete template", error);
  }
}

export default deleteTemplate;
