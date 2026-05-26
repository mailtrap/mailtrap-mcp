import { requireClient } from "../../client";
import { DeleteContactFieldRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteContactField({
  field_id,
}: DeleteContactFieldRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact fields");

    await mailtrap.contactFields.delete(field_id);

    return buildSuccessResponse(
      JSON.stringify({ field_id, deleted: true }, null, 2)
    );
  } catch (error) {
    return buildErrorResponse("delete contact field", error);
  }
}

export default deleteContactField;
