import { requireClient } from "../../client";
import { GetSandboxInboxRequest } from "../../types/mailtrap";

async function getSandboxInbox({ inbox_id }: GetSandboxInboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    const inboxIdRaw = inbox_id ?? process.env.MAILTRAP_TEST_INBOX_ID;
    if (inboxIdRaw === undefined || inboxIdRaw === null) {
      throw new Error(
        "Provide inbox_id or set MAILTRAP_TEST_INBOX_ID environment variable"
      );
    }

    const resolvedInboxId = Number(inboxIdRaw);
    if (Number.isNaN(resolvedInboxId)) {
      throw new Error(
        "inbox_id (or MAILTRAP_TEST_INBOX_ID) must be a valid number"
      );
    }

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

    return {
      content: [
        {
          type: "text",
          text: `Sandbox inbox details:\n\n${lines}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sandbox inbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSandboxInbox;
