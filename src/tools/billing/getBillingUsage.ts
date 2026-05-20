import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getBillingUsage(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("billing");

    const usage = await mailtrap.general.billing.getCurrentBillingCycleUsage();

    return buildSuccessResponse(JSON.stringify(usage, null, 2));
  } catch (error) {
    return buildErrorResponse("get billing usage", error);
  }
}

export default getBillingUsage;
