import { requireClient } from "../../client";
import { ListTrackingOptOutsRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listTrackingOptOuts({
  email,
  start_time,
  end_time,
  last_id,
}: ListTrackingOptOutsRequest = {}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("tracking opt-outs", {
      requireAccountId: false,
    });

    const response = await mailtrap.trackingOptOuts.getList({
      ...(email !== undefined && { email }),
      ...(start_time !== undefined && { start_time }),
      ...(end_time !== undefined && { end_time }),
      ...(last_id !== undefined && { last_id }),
    });

    const optOuts = response.data;

    if (!optOuts || optOuts.length === 0) {
      return buildSuccessResponse(
        email
          ? `No tracking opt-outs found matching email "${email}".`
          : "No tracking opt-outs in your Mailtrap account."
      );
    }

    const lines = optOuts.map(
      (o) =>
        `• ${o.email} (ID: ${o.id}, domain: ${o.domain_name}, created: ${o.created_at})`
    );

    const nextPage = response.last_id
      ? `\n\nMore results available — pass last_id: "${response.last_id}" to fetch the next page.`
      : "";

    return buildSuccessResponse(
      `Tracking opt-outs (${optOuts.length}):\n\n${lines.join("\n")}${nextPage}`
    );
  } catch (error) {
    return buildErrorResponse("list tracking opt-outs", error);
  }
}

export default listTrackingOptOuts;
