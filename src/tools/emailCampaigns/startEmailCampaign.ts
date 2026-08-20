import { requireClient } from "../../client";
import { StartEmailCampaignRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function startEmailCampaign({
  email_campaign_id,
}: StartEmailCampaignRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    });

    const response = await mailtrap.emailCampaigns.start(email_campaign_id);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("start email campaign", error);
  }
}

export default startEmailCampaign;
