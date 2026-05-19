import { requireClient } from "../../client";
import { DeleteContactListRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteContactList({
  list_id,
}: DeleteContactListRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact lists");

    await mailtrap.contactLists.delete(list_id);

    return buildSuccessResponse(
      JSON.stringify({ list_id, deleted: true }, null, 2)
    );
  } catch (error) {
    return buildErrorResponse("delete contact list", error);
  }
}

export default deleteContactList;
