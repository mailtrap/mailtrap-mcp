import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { updateEmailCampaignZod } from "./schemas/updateEmailCampaign";

async function updateEmailCampaign(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = updateEmailCampaignZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { email_campaign_id: emailCampaignId, ...params } = parsed.data;

    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    });

    const response = await mailtrap.emailCampaigns.update(
      emailCampaignId,
      params
    );

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("update email campaign", error);
  }
}

export default updateEmailCampaign;
