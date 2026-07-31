import { requireClient } from "../../client";
import {
  EmailCampaignsClient,
  EmailCampaignListResponse,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listEmailCampaignsZod } from "./schemas/listEmailCampaigns";

async function listEmailCampaigns(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listEmailCampaignsZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const params = parsed.data;

    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    }) as unknown as EmailCampaignsClient;

    const response = (await mailtrap.emailCampaigns.getList(
      Object.keys(params).length > 0 ? params : undefined
    )) as EmailCampaignListResponse | null | undefined;

    const campaigns = response?.data ?? [];

    if (campaigns.length === 0) {
      return buildSuccessResponse(
        "No email campaigns in your Mailtrap account."
      );
    }

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("list email campaigns", error);
  }
}

export default listEmailCampaigns;
