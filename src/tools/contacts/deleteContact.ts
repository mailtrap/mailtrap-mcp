import { requireClient } from "../../client";
import { Contact, DeleteContactRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteContact({
  contact_identifier,
}: DeleteContactRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contacts");

    const response = (await mailtrap.contacts.delete(contact_identifier)) as
      | { data?: Contact }
      | undefined;

    if (response?.data) {
      return buildSuccessResponse(JSON.stringify(response.data, null, 2));
    }

    return buildSuccessResponse(
      JSON.stringify({ contact_identifier, deleted: true }, null, 2)
    );
  } catch (error) {
    return buildErrorResponse("delete contact", error);
  }
}

export default deleteContact;
