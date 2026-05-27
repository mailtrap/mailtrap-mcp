import { requireClient } from "../../client";
import {
  ContactExport,
  CreateContactExportRequest,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createContactExport(
  params: CreateContactExportRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact exports");

    const response = (await mailtrap.contactExports.create(
      params as Parameters<typeof mailtrap.contactExports.create>[0]
    )) as ContactExport;

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("create contact export", error);
  }
}

export default createContactExport;
