import { getSandboxClient } from "../../client";
import { BatchSendSandboxEmailToolRequest } from "../../types/mailtrap";
import buildBatchPayload from "../sendEmail/buildBatchPayload";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import resolveSandboxId from "./utils/resolveSandboxId";

async function batchSendSandboxEmail({
  test_inbox_id,
  ...body
}: BatchSendSandboxEmailToolRequest): Promise<ToolResponse> {
  try {
    const inboxId = resolveSandboxId(
      test_inbox_id,
      "test_inbox_id",
      "MAILTRAP_TEST_INBOX_ID"
    );

    const payload = buildBatchPayload(body);

    const mailtrap = getSandboxClient(inboxId);

    const response = await mailtrap.batchSend(
      payload as unknown as Parameters<typeof mailtrap.batchSend>[0]
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("batch send sandbox email", error);
  }
}

export default batchSendSandboxEmail;
