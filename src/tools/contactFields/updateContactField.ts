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

    const raw = (await mailtrap.contactFields.update(field_id, params)) as
      | ContactField
      | { data?: ContactField }
      | null
      | undefined;
    const field =
      raw && typeof raw === "object" && "data" in raw && raw.data
        ? raw.data
        : (raw as ContactField);

    return buildSuccessResponse(JSON.stringify(field, null, 2));
  } catch (error) {
    return buildErrorResponse("update contact field", error);
  }
}

export default updateContactField;
