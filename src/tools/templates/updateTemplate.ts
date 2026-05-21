import { UpdateTemplateRequest } from "../../types/mailtrap";
import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateTemplate({
  template_id,
  name,
  subject,
  html,
  text,
  category,
}: UpdateTemplateRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("templates", { requireAccountId: false });

    if (
      name === undefined &&
      subject === undefined &&
      html === undefined &&
      text === undefined &&
      category === undefined
    ) {
      throw new Error(
        "At least one update field (name, subject, html, text, or category) must be provided"
      );
    }

    if (html !== undefined && text !== undefined && !html && !text) {
      throw new Error(
        "If updating both html and text, at least one must have content"
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (subject !== undefined) updateData.subject = subject;
    if (html !== undefined) updateData.body_html = html;
    if (text !== undefined) updateData.body_text = text;
    if (category !== undefined) updateData.category = category;

    const template = await mailtrap.templates.update(
      template_id,
      updateData as Parameters<typeof mailtrap.templates.update>[1]
    );

    return buildSuccessResponse(
      `Template "${template.name}" updated.\n\n${JSON.stringify(
        template,
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("update template", error);
  }
}

export default updateTemplate;
