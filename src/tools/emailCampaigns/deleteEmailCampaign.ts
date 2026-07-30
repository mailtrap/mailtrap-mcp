import { requireClient } from "../../client";
import {
  DeleteEmailCampaignRequest,
  EmailCampaignsClient,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteEmailCampaign({
  email_campaign_id,
}: DeleteEmailCampaignRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient(
      "email campaigns"
    ) as unknown as EmailCampaignsClient;

    await mailtrap.emailCampaigns.delete(email_campaign_id);

    return buildSuccessResponse(
      JSON.stringify({ email_campaign_id, deleted: true }, null, 2)
    );
  } catch (error) {
    return buildErrorResponse("delete email campaign", error);
  }
}

export default deleteEmailCampaign;
