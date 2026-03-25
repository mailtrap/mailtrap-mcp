import { requireClient } from "../../client";
import { UpdateSandboxInboxRequest } from "../../types/mailtrap";

async function updateSandboxInbox({
  inbox_id,
  name,
  email_username,
}: UpdateSandboxInboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox inboxes");

    if (!name && !email_username) {
      throw new Error(
        "At least one of 'name' or 'email_username' must be provided"
      );
    }

    const params: Record<string, string> = {};
    if (name) {
      params.name = name;
    }
    if (email_username) {
      params.emailUsername = email_username;
    }

    const inbox = await mailtrap.testing.inboxes.updateInbox(
      inbox_id,
      params as { name: string; emailUsername: string }
    );

    return {
      content: [
        {
          type: "text",
          text: `Sandbox inbox updated successfully:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}\n• Email address: ${inbox.email_username}@${inbox.email_domain}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to update sandbox inbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default updateSandboxInbox;
