import { requireClient } from "../../client";
import { Contact, UpdateContactRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateContact({
  contact_identifier,
  ...params
}: UpdateContactRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contacts");

    const response = (await mailtrap.contacts.update(
      contact_identifier,
      params as Parameters<typeof mailtrap.contacts.update>[1]
    )) as { data: Contact };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("update contact", error);
  }
}

export default updateContact;
