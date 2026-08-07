import { requireClient } from "../../client";
import { EmailCampaignsClient } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createEmailCampaignZod } from "./schemas/createEmailCampaign";

async function createEmailCampaign(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createEmailCampaignZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const mailtrap = requireClient("email campaigns", {
      requireAccountId: false,
    }) as unknown as EmailCampaignsClient;

    const response = await mailtrap.emailCampaigns.create(parsed.data);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("create email campaign", error);
  }
}

export default createEmailCampaign;
