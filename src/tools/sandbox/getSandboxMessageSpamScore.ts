import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageSpamScore({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const report = await sandboxClient.testing.messages.getSpamScore(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(JSON.stringify(report, null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox message spam score", error);
  }
}

export default getSandboxMessageSpamScore;
