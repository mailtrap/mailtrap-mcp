import { requireClient } from "../../client";
import { CreateContactEventRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createContactEvent({
  contact_identifier,
  name,
  params,
}: CreateContactEventRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contacts");

    const response = await mailtrap.contactEvents.create(contact_identifier, {
      name,
      params,
    });

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("create contact event", error);
  }
}

export default createContactEvent;
