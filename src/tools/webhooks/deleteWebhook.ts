import { requireClient } from "../../client";
import { DeleteWebhookRequest, Webhook } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteWebhook({
  webhook_id,
}: DeleteWebhookRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("webhooks");

    const response = (await mailtrap.webhooks.delete(webhook_id)) as {
      data: Webhook;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("delete webhook", error);
  }
}

export default deleteWebhook;
