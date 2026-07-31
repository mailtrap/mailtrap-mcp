import { requireClient } from "../../client";
import {
  EmailCampaignsClient,
  TerminateEmailCampaignRequest,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function terminateEmailCampaign({
  email_campaign_id,
}: TerminateEmailCampaignRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    }) as unknown as EmailCampaignsClient;

    const response = await mailtrap.emailCampaigns.terminate(email_campaign_id);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("terminate email campaign", error);
  }
}

export default terminateEmailCampaign;
