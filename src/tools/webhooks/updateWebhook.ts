import { requireClient } from "../../client";
import { UpdateWebhookRequest, Webhook } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function updateWebhook({
  webhook_id,
  ...params
}: UpdateWebhookRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("webhooks");

    const response = (await mailtrap.webhooks.update(webhook_id, params)) as {
      data: Webhook;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("update webhook", error);
  }
}

export default updateWebhook;
