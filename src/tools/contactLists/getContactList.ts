import { requireClient } from "../../client";
import { ContactList, GetContactListRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getContactList({
  list_id,
}: GetContactListRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact lists");

    const list = (await mailtrap.contactLists.get(list_id)) as ContactList;

    return buildSuccessResponse(JSON.stringify(list, null, 2));
  } catch (error) {
    return buildErrorResponse("get contact list", error);
  }
}

export default getContactList;
