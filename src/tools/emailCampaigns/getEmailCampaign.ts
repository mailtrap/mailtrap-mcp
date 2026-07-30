import { requireClient } from "../../client";
import {
  EmailCampaignsClient,
  GetEmailCampaignRequest,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getEmailCampaign({
  email_campaign_id,
}: GetEmailCampaignRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient(
      "email campaigns"
    ) as unknown as EmailCampaignsClient;

    const response = await mailtrap.emailCampaigns.get(email_campaign_id);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get email campaign", error);
  }
}

export default getEmailCampaign;
