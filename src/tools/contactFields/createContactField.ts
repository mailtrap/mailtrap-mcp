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

    const response = (await mailtrap.contactFields.create(params)) as {
      data: ContactField;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("create contact field", error);
  }
}

export default createContactField;
