import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageText({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const text = await sandboxClient.testing.messages.getTextMessage(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(text ?? "");
  } catch (error) {
    return buildErrorResponse("get sandbox message text body", error);
  }
}

export default getSandboxMessageText;
