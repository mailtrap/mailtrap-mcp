import { requireClient } from "../../client";
import { ContactField, CreateContactFieldRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createContactField(
  params: CreateContactFieldRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact fields");

    const raw = (await mailtrap.contactFields.create(params)) as
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
    return buildErrorResponse("create contact field", error);
  }
}

export default createContactField;
