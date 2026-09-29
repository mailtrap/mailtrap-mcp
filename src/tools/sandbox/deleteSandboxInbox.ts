import { requireClient } from "../../client";
import { DeleteSandboxInboxRequest } from "../../types/mailtrap";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function deleteSandboxInbox({
  sandbox_id,
  inbox_id,
}: DeleteSandboxInboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandbox inboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    const inbox = await mailtrap.testing.inboxes.delete(resolvedInboxId);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox inbox deleted successfully:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to delete sandbox inbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default deleteSandboxInbox;
