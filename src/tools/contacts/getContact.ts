import { requireClient } from "../../client";
import { Contact, GetContactRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getContact({
  contact_identifier,
}: GetContactRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contacts");

    const response = (await mailtrap.contacts.get(contact_identifier)) as {
      data: Contact;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get contact", error);
  }
}

export default getContact;
