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

    const response = (await mailtrap.contactFields.get(field_id)) as {
      data: ContactField;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get contact field", error);
  }
}

export default getContactField;
