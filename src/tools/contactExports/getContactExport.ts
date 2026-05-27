import { requireClient } from "../../client";
import { ContactExport, GetContactExportRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getContactExport({
  export_id,
}: GetContactExportRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact exports");

    const response = (await mailtrap.contactExports.get(
      export_id
    )) as ContactExport;

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("get contact export", error);
  }
}

export default getContactExport;
