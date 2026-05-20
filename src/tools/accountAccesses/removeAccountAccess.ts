import { requireClient } from "../../client";
import { RemoveAccountAccessRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function removeAccountAccess({
  account_access_id,
}: RemoveAccountAccessRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("account accesses");

    const response = await mailtrap.general.accountAccesses.removeAccountAccess(
      account_access_id
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("remove account access", error);
  }
}

export default removeAccountAccess;
