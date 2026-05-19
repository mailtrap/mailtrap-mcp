import { requireClient } from "../../client";
import { ContactList, CreateContactListRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createContactList({
  name,
}: CreateContactListRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact lists");

    const list = (await mailtrap.contactLists.create({
      name,
    })) as ContactList;

    return buildSuccessResponse(JSON.stringify(list, null, 2));
  } catch (error) {
    return buildErrorResponse("create contact list", error);
  }
}

export default createContactList;
