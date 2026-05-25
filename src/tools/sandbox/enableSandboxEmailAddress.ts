import { requireClient } from "../../client";
import { SandboxIdRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function enableSandboxEmailAddress({
  sandbox_id,
}: SandboxIdRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandbox = await mailtrap.testing.inboxes.enableEmailAddress(
      sandbox_id
    );

    return buildSuccessResponse(
      `Email address for sandbox "${sandbox.name}" (ID: ${sandbox.id}) enabled. Address: ${sandbox.email_username}@${sandbox.email_domain}`
    );
  } catch (error) {
    return buildErrorResponse("enable sandbox email address", error);
  }
}

export default enableSandboxEmailAddress;
