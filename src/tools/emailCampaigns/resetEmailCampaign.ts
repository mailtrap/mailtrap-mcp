import { requireClient } from "../../client";
import { ResetEmailCampaignRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function resetEmailCampaign({
  email_campaign_id,
}: ResetEmailCampaignRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    });

    const response = await mailtrap.emailCampaigns.reset(email_campaign_id);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("reset email campaign", error);
  }
}

export default resetEmailCampaign;
