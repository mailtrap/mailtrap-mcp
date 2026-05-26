import { requireClient } from "../../client";
import { Contact, CreateContactRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createContact(
  params: CreateContactRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contacts");

    const response = (await mailtrap.contacts.create(params)) as {
      data: Contact;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("create contact", error);
  }
}

export default createContact;
