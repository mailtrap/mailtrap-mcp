import { requireClient } from "../../client";
import { SandboxIdRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function resetSandboxCredentials({
  sandbox_id,
}: SandboxIdRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandbox = await mailtrap.testing.inboxes.resetCredentials(sandbox_id);

    return buildSuccessResponse(
      [
        `SMTP credentials for sandbox "${sandbox.name}" (ID: ${sandbox.id}) have been reset.`,
        `Username: ${sandbox.username}`,
        `Password: ${sandbox.password}`,
      ].join("\n")
    );
  } catch (error) {
    return buildErrorResponse("reset sandbox credentials", error);
  }
}

export default resetSandboxCredentials;
