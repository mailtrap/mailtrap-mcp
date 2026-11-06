import { requireClient } from "../../client";
import { MailtrapAccount } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listAccounts(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("accounts", { requireAccountId: false });

    const accounts = (await mailtrap.general.accounts.getAllAccounts()) as
      | MailtrapAccount[]
      | null
      | undefined;

    if (!accounts || accounts.length === 0) {
      return buildSuccessResponse(
        "No Mailtrap accounts accessible to this API token."
      );
    }

    return buildSuccessResponse(JSON.stringify(accounts, null, 2));
  } catch (error) {
    return buildErrorResponse("list accounts", error);
  }
}

export default listAccounts;
