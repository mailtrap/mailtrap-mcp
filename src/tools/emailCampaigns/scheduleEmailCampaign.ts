import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { scheduleEmailCampaignZod } from "./schemas/scheduleEmailCampaign";

async function scheduleEmailCampaign(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = scheduleEmailCampaignZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { email_campaign_id: emailCampaignId, datetime } = parsed.data;

    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    });

    const response = await mailtrap.emailCampaigns.schedule(emailCampaignId, {
      datetime,
    });

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("schedule email campaign", error);
  }
}

export default scheduleEmailCampaign;
