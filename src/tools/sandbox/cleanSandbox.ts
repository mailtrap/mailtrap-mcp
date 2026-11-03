import { requireClient } from "../../client";
import { CleanSandboxRequest } from "../../types/mailtrap";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function cleanSandbox({
  sandbox_id,
  inbox_id,
}: CleanSandboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    const inbox = await mailtrap.testing.inboxes.cleanInbox(resolvedInboxId);

    return {
      content: [
        {
          type: "text",
          text: `All messages deleted from sandbox:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}\n• Emails remaining: ${inbox.emails_count}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to clean sandbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default cleanSandbox;
