import { requireClient } from "../../client";
import { DeleteSuppressionRequest, Suppression } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteSuppression({
  suppression_id,
}: DeleteSuppressionRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("suppressions");

    const deleted = (await mailtrap.suppressions.delete(
      suppression_id
    )) as Suppression;

    return buildSuccessResponse(
      `Suppression ${deleted.id} (${deleted.email}, type: ${deleted.type}) deleted.`
    );
  } catch (error) {
    return buildErrorResponse("delete suppression", error);
  }
}

export default deleteSuppression;
