import { requireClient } from "../../client";
import { GetWebhookRequest, Webhook } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getWebhook({
  webhook_id,
}: GetWebhookRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("webhooks");

    const response = (await mailtrap.webhooks.get(webhook_id)) as {
      data: Webhook;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get webhook", error);
  }
}

export default getWebhook;
