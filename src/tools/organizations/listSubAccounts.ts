import { getOrganizationClient } from "../../client";
import { SubAccount } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listSubAccounts(): Promise<ToolResponse> {
  try {
    const mailtrap = getOrganizationClient();

    const subAccounts = (await mailtrap.organizations.subAccounts.getList()) as
      | SubAccount[]
      | null
      | undefined;

    if (!subAccounts || subAccounts.length === 0) {
      return buildSuccessResponse("No sub-accounts in this organization.");
    }

    return buildSuccessResponse(JSON.stringify(subAccounts, null, 2));
  } catch (error) {
    return buildErrorResponse("list sub-accounts", error);
  }
}

export default listSubAccounts;
