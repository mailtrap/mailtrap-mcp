import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageHtmlAnalysis({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const analysis = await sandboxClient.testing.messages.getHtmlAnalysis(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(JSON.stringify(analysis, null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox message HTML analysis", error);
  }
}

export default getSandboxMessageHtmlAnalysis;
