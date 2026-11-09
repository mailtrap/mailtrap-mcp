import { requireClient } from "../../client";
import { GetSandboxRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import resolveSandboxId from "./utils/resolveSandboxId";

async function getSandbox({
  sandbox_id,
  inbox_id,
}: GetSandboxRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sandboxes");

    const resolvedInboxId = resolveSandboxId(sandbox_id ?? inbox_id);

    const inbox = await mailtrap.testing.inboxes.getInboxAttributes(
      resolvedInboxId
    );

    const lines = [
      `• Name: ${inbox.name}`,
      `• ID: ${inbox.id}`,
      `• Status: ${inbox.status}`,
      `• Emails: ${inbox.emails_count} (${inbox.emails_unread_count} unread)`,
      `• Max size: ${inbox.max_size}`,
      `• SMTP Username: ${inbox.username}`,
      `• SMTP Password: ${inbox.password}`,
      `• Domain: ${inbox.domain}`,
      `• SMTP Ports: ${inbox.smtp_ports?.join(", ") ?? "N/A"}`,
      `• POP3 Domain: ${inbox.pop3_domain}`,
      `• POP3 Ports: ${inbox.pop3_ports?.join(", ") ?? "N/A"}`,
      `• Email address: ${inbox.email_username}@${inbox.email_domain} (${
        inbox.email_username_enabled ? "enabled" : "disabled"
      })`,
      `• Project ID: ${inbox.project_id}`,
      `• Last message sent: ${inbox.last_message_sent_at ?? "never"}`,
    ].join("\n");

    return buildSuccessResponse(`Sandbox details:\n\n${lines}`);
  } catch (error) {
    return buildErrorResponse("get sandbox", error);
  }
}

export default getSandbox;
