import { requireClient } from "../../client";
import { DeleteSandboxRequest } from "../../types/mailtrap";
import { resolveRequiredSandboxInboxId } from "./utils/resolveSandboxId";

async function deleteSandbox({
  sandbox_id,
  inbox_id,
}: DeleteSandboxRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandboxes");
    const resolvedInboxId = resolveRequiredSandboxInboxId({
      sandbox_id,
      inbox_id,
    });

    const inbox = await mailtrap.testing.inboxes.delete(resolvedInboxId);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox deleted successfully:\n\n• Name: ${inbox.name}\n• ID: ${inbox.id}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to delete sandbox: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default deleteSandbox;
