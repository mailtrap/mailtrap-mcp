import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listTemplates(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("templates");

    const templates = await mailtrap.templates.getList();

    return buildSuccessResponse(JSON.stringify(templates ?? [], null, 2));
  } catch (error) {
    return buildErrorResponse("list templates", error);
  }
}

export default listTemplates;
