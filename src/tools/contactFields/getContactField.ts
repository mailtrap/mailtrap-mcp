import { requireClient } from "../../client";
import { ContactField, GetContactFieldRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getContactField({
  field_id,
}: GetContactFieldRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact fields");

    const raw = (await mailtrap.contactFields.get(field_id)) as
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
    return buildErrorResponse("get contact field", error);
  }
}

export default getContactField;
