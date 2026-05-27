import { requireClient } from "../../client";
import { removeAccountAccessZod } from "./schemas/removeAccountAccess";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function removeAccountAccess(raw: unknown): Promise<ToolResponse> {
  const parsed = removeAccountAccessZod.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return buildErrorResponse(
      "remove account access",
      new Error(`Invalid input: ${msg}`)
    );
  }

  try {
    const mailtrap = requireClient("account accesses");

    const response = await mailtrap.general.accountAccesses.removeAccountAccess(
      parsed.data.account_access_id
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("remove account access", error);
  }
}

export default removeAccountAccess;
