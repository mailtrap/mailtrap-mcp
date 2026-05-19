import { requireClient } from "../../client";
import { Webhook } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listWebhooks(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("webhooks");

    const response = (await mailtrap.webhooks.getList()) as {
      data: Webhook[];
    };
    const webhooks = response?.data ?? [];

    if (webhooks.length === 0) {
      return buildSuccessResponse("No webhooks in your Mailtrap account.");
    }

    return buildSuccessResponse(JSON.stringify(webhooks, null, 2));
  } catch (error) {
    return buildErrorResponse("list webhooks", error);
  }
}

export default listWebhooks;
