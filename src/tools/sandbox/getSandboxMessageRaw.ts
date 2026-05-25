import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageRaw({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const raw = await sandboxClient.testing.messages.getRawMessage(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(raw ?? "");
  } catch (error) {
    return buildErrorResponse("get sandbox message raw body", error);
  }
}

export default getSandboxMessageRaw;
