import { getSandboxClient } from "../../client";
import { SandboxMessageRequest } from "../../types/mailtrap";
import resolveSandboxId from "./utils/resolveSandboxId";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSandboxMessageEml({
  sandbox_id,
  message_id,
}: SandboxMessageRequest): Promise<ToolResponse> {
  try {
    const sandboxId = resolveSandboxId(sandbox_id);
    const sandboxClient = getSandboxClient(sandboxId);

    const eml = await sandboxClient.testing.messages.getMessageAsEml(
      sandboxId,
      message_id
    );

    return buildSuccessResponse(eml ?? "");
  } catch (error) {
    return buildErrorResponse("get sandbox message as EML", error);
  }
}

export default getSandboxMessageEml;
