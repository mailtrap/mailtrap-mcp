import { requireClient } from "../../client";
import { ContactImport, GetContactImportRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getContactImport({
  import_id,
}: GetContactImportRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact imports");

    const response = (await mailtrap.contactImports.get(
      import_id
    )) as ContactImport;

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("get contact import", error);
  }
}

export default getContactImport;
