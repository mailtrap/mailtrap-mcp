import { requireClient } from "../../client";
import { CleanSandboxInboxRequest } from "../../types/mailtrap";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function cleanSandboxInbox({
  sandbox_id,
  inbox_id,
}: CleanSandboxInboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox inboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    const inbox = await mailtrap.testing.inboxes.cleanInbox(resolvedInboxId);

    return {
      content: [
        {
          type: "text",
          text: `All messages deleted from sandbox inbox:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}\n• Emails remaining: ${inbox.emails_count}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to clean sandbox inbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default cleanSandboxInbox;
