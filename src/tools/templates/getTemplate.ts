import { requireClient } from "../../client";
import { GetTemplateRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getTemplate({
  template_id,
}: GetTemplateRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("templates");

    const template = await mailtrap.templates.get(template_id);

    return buildSuccessResponse(JSON.stringify(template, null, 2));
  } catch (error) {
    return buildErrorResponse("get template", error);
  }
}

export default getTemplate;
