import { requireClient } from "../../client";
import { BatchSendEmailToolRequest } from "../../types/mailtrap";
import buildBatchPayload from "./buildBatchPayload";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function batchSendTransactionalEmail(
  body: BatchSendEmailToolRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("batch sending transactional email", {
      requireAccountId: false,
    });

    const payload = buildBatchPayload(body);

    const response = await mailtrap.batchSend(
      payload as unknown as Parameters<typeof mailtrap.batchSend>[0]
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("batch send transactional email", error);
  }
}

export default batchSendTransactionalEmail;
