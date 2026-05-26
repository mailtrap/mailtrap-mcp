import { requireClient } from "../../client";
import { ContactList } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listContactLists(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("contact lists");

    const lists = (await mailtrap.contactLists.getList()) as
      | ContactList[]
      | null
      | undefined;

    if (!lists || lists.length === 0) {
      return buildSuccessResponse("No contact lists in your Mailtrap account.");
    }

    return buildSuccessResponse(JSON.stringify(lists, null, 2));
  } catch (error) {
    return buildErrorResponse("list contact lists", error);
  }
}

export default listContactLists;
