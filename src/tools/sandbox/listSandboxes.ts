import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listSandboxes(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandboxes = await mailtrap.testing.inboxes.getList();

    if (!sandboxes || sandboxes.length === 0) {
      return buildSuccessResponse(
        "No sandboxes found in your Mailtrap account."
      );
    }

    const lines = sandboxes.map(
      (sandbox: any) =>
        `• ${sandbox.name} (ID: ${sandbox.id}, project: ${
          sandbox.project_id ?? "?"
        }, emails: ${sandbox.emails_count ?? 0})`
    );

    return buildSuccessResponse(
      `Sandboxes (${sandboxes.length}):\n\n${lines.join("\n")}`
    );
  } catch (error) {
    return buildErrorResponse("list sandboxes", error);
  }
}

export default listSandboxes;
