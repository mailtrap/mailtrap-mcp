import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getEmailCampaignStatsZod } from "./schemas/getEmailCampaignStats";

async function getEmailCampaignStats(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getEmailCampaignStatsZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const {
      email_campaign_id: emailCampaignId,
      start_date: startDate,
      end_date: endDate,
    } = parsed.data;

    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    });

    const params = {
      ...(startDate !== undefined ? { start_date: startDate } : {}),
      ...(endDate !== undefined ? { end_date: endDate } : {}),
    };

    const response = await mailtrap.emailCampaigns.getStats(
      emailCampaignId,
      Object.keys(params).length > 0 ? params : undefined
    );

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get email campaign stats", error);
  }
}

export default getEmailCampaignStats;
