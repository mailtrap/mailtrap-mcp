import { requireClient } from "../../client";
import { DeleteTrackingOptOutRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteTrackingOptOut({
  tracking_opt_out_id,
}: DeleteTrackingOptOutRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("tracking opt-outs", {
      requireAccountId: false,
    });

    const deleted = await mailtrap.trackingOptOuts.delete(tracking_opt_out_id);

    return buildSuccessResponse(
      `Tracking opt-out ${deleted.id} (${deleted.email}) deleted. Open and click tracking applies to this address again.`
    );
  } catch (error) {
    return buildErrorResponse("delete tracking opt-out", error);
  }
}

export default deleteTrackingOptOut;
