import { CreateTemplateRequest } from "../../types/mailtrap";
import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createTemplate({
  name,
  subject,
  html,
  text,
  category,
}: CreateTemplateRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("templates");

    if (!html && !text) {
      throw new Error(
        "At least one of 'html' or 'text' content must be provided."
      );
    }

    const createParams: Record<string, unknown> = {
      name,
      subject,
      category: category || "General",
    };

    if (html) createParams.body_html = html;
    if (text) createParams.body_text = text;

    const template = await mailtrap.templates.create(
      createParams as unknown as Parameters<typeof mailtrap.templates.create>[0]
    );

    return buildSuccessResponse(
      `Template "${name}" created.\n\n${JSON.stringify(template, null, 2)}`
    );
  } catch (error) {
    return buildErrorResponse("create template", error);
  }
}

export default createTemplate;
