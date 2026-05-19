import { requireClient } from "../../client";
import { ContactField, UpdateContactFieldRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateContactField({
  field_id,
  ...params
}: UpdateContactFieldRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact fields");

    const response = (await mailtrap.contactFields.update(
      field_id,
      params
    )) as { data: ContactField };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("update contact field", error);
  }
}

export default updateContactField;
