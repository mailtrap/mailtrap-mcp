import { requireClient } from "../../client";
import {
  CancelEmailCampaignRequest,
  EmailCampaignsClient,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function cancelEmailCampaign({
  email_campaign_id,
}: CancelEmailCampaignRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient(
      "email campaigns"
    ) as unknown as EmailCampaignsClient;

    const response = await mailtrap.emailCampaigns.cancel(email_campaign_id);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("cancel email campaign", error);
  }
}

export default cancelEmailCampaign;
