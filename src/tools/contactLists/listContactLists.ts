import { requireClient } from "../../client";
import { ContactList } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listContactListsZod } from "./schemas/listContactLists";

async function listContactLists(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listContactListsZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { search } = parsed.data;

    const mailtrap = requireClient("contact lists");

    const lists = (await mailtrap.contactLists.getList(
      search ? { search } : undefined
    )) as ContactList[] | null | undefined;

    if (!lists || lists.length === 0) {
      return buildSuccessResponse("No contact lists in your Mailtrap account.");
    }

    return buildSuccessResponse(JSON.stringify(lists, null, 2));
  } catch (error) {
    return buildErrorResponse("list contact lists", error);
  }
}

export default listContactLists;
