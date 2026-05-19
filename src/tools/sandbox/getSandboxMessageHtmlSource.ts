import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageHtmlSource({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const source = await sandboxClient.testing.messages.getMessageHtmlSource(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(source ?? "");
  } catch (error) {
    return buildErrorResponse("get sandbox message HTML source", error);
  }
}

export default getSandboxMessageHtmlSource;
