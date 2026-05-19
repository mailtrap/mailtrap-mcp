import { requireClient } from "../../client";
import { ContactList, UpdateContactListRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateContactList({
  list_id,
  name,
}: UpdateContactListRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact lists");

    const list = (await mailtrap.contactLists.update(list_id, {
      name,
    })) as ContactList;

    return buildSuccessResponse(JSON.stringify(list, null, 2));
  } catch (error) {
    return buildErrorResponse("update contact list", error);
  }
}

export default updateContactList;
