import { getOrganizationClient } from "../../client";
import { deleteSubAccountZod } from "./schemas/deleteSubAccount";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteSubAccount(raw: unknown): Promise<ToolResponse> {
  const parsed = deleteSubAccountZod.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return buildErrorResponse(
      "delete sub-account",
      new Error(`Invalid input: ${msg}`)
    );
  }

  const subAccountId = parsed.data.sub_account_id;

  try {
    const mailtrap = getOrganizationClient();
    await mailtrap.organizations.subAccounts.delete(subAccountId);

    return buildSuccessResponse(
      JSON.stringify({ sub_account_id: subAccountId, deleted: true }, null, 2)
    );
  } catch (error) {
    return buildErrorResponse("delete sub-account", error);
  }
}

export default deleteSubAccount;
