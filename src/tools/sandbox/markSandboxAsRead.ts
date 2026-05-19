import { requireClient } from "../../client";
import { SandboxIdRequest } from "../../types/mailtrap";

async function markSandboxAsRead({ sandbox_id }: SandboxIdRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandbox = await mailtrap.testing.inboxes.markAsRead(sandbox_id);

    return {
      content: [
        {
          type: "text",
          text: `Marked all messages in sandbox "${sandbox.name}" (ID: ${sandbox.id}) as read.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to mark sandbox as read: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default markSandboxAsRead;
