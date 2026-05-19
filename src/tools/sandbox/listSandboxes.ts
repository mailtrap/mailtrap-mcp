import { requireClient } from "../../client";

async function listSandboxes(): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandboxes = await mailtrap.testing.inboxes.getList();

    if (!sandboxes || sandboxes.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No sandboxes found in your Mailtrap account.",
          },
        ],
      };
    }

    const lines = sandboxes.map(
      (sandbox: any) =>
        `• ${sandbox.name} (ID: ${sandbox.id}, project: ${
          sandbox.project_id ?? "?"
        }, emails: ${sandbox.emails_count ?? 0})`
    );

    return {
      content: [
        {
          type: "text",
          text: `Sandboxes (${sandboxes.length}):\n\n${lines.join("\n")}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to list sandboxes: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default listSandboxes;
