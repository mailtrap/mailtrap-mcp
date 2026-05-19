import { requireClient } from "../../client";
import {
  CreateWebhookRequest,
  WebhookWithSigningSecret,
} from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createWebhook(
  params: CreateWebhookRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("webhooks");

    const response = (await mailtrap.webhooks.create(params)) as {
      data: WebhookWithSigningSecret;
    };

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("create webhook", error);
  }
}

export default createWebhook;
