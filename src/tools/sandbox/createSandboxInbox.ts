import { requireClient } from "../../client";
import { CreateSandboxInboxRequest } from "../../types/mailtrap";

async function createSandboxInbox({
  project_id,
  name,
}: CreateSandboxInboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

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

    return {
      content: [
        {
          type: "text",
          text: `Sandbox inbox created successfully:\n\n${smtpInfo}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to create sandbox inbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default createSandboxInbox;
