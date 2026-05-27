import { requireClient } from "../../client";
import {
  ContactImport,
  CreateContactImportRequest,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createContactImport(
  params: CreateContactImportRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact imports");

    const response = (await mailtrap.contactImports.create(
      params as Parameters<typeof mailtrap.contactImports.create>[0]
    )) as ContactImport;

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("create contact import", error);
  }
}

export default createContactImport;
