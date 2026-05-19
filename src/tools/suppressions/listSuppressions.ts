import { requireClient } from "../../client";
import { ListSuppressionsRequest, Suppression } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listSuppressions({
  email,
}: ListSuppressionsRequest = {}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("suppressions");

    const suppressions = (await mailtrap.suppressions.getList(
      email ? { email } : undefined
    )) as Suppression[] | null | undefined;

    if (!suppressions || suppressions.length === 0) {
      return buildSuccessResponse(
        email
          ? `No suppressions found matching email "${email}".`
          : "No suppressions in your Mailtrap account."
      );
    }

    const lines = suppressions.map(
      (s) =>
        `• ${s.email} (ID: ${s.id}, type: ${s.type}, stream: ${s.sending_stream}, created: ${s.created_at})`
    );

    return buildSuccessResponse(
      `Suppressions (${suppressions.length}):\n\n${lines.join("\n")}`
    );
  } catch (error) {
    return buildErrorResponse("list suppressions", error);
  }
}

export default listSuppressions;
