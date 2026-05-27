import { getOrganizationClient } from "../../client";
import { CreateSubAccountRequest, SubAccount } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createSubAccount({
  name,
}: CreateSubAccountRequest): Promise<ToolResponse> {
  try {
    const mailtrap = getOrganizationClient();

    const response = (await mailtrap.organizations.subAccounts.create({
      name,
    })) as SubAccount;

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("create sub-account", error);
  }
}

export default createSubAccount;
