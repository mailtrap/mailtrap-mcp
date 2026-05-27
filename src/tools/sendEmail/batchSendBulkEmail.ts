import { getBulkClient } from "../../client";
import { BatchSendEmailToolRequest } from "../../types/mailtrap";
import buildBatchPayload from "./buildBatchPayload";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function batchSendBulkEmail(
  body: BatchSendEmailToolRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = getBulkClient();

    const payload = buildBatchPayload(body);

    const response = await mailtrap.batchSend(
      payload as unknown as Parameters<typeof mailtrap.batchSend>[0]
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("batch send bulk email", error);
  }
}

export default batchSendBulkEmail;
