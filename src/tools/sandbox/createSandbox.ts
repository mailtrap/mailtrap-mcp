import { requireClient } from "../../client";
import { CreateSandboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createSandbox({
  project_id,
  name,
}: CreateSandboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");

    const inbox = await mailtrap.testing.inboxes.create(project_id, name);

    const smtpInfo = [
      `• Name: ${inbox.name}`,
      `• ID: ${inbox.id}`,
      `• SMTP Username: ${inbox.username}`,
      `• SMTP Password: ${inbox.password}`,
      `• Domain: ${inbox.domain}`,
      `• SMTP Ports: ${inbox.smtp_ports?.join(", ") ?? "N/A"}`,
      `• POP3 Ports: ${inbox.pop3_ports?.join(", ") ?? "N/A"}`,
    ].join("\n");

    return buildSuccessResponse(`Sandbox created successfully:\n\n${smtpInfo}`);
  } catch (error) {
    return buildErrorResponse("create sandbox", error);
  }
}

export default createSandbox;
