import { requireClient } from "../../client";
import { SandboxIdRequest } from "../../types/mailtrap";

async function resetSandboxCredentials({
  sandbox_id,
}: SandboxIdRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandbox = await mailtrap.testing.inboxes.resetCredentials(sandbox_id);

    return {
      content: [
        {
          type: "text",
          text: [
            `SMTP credentials for sandbox "${sandbox.name}" (ID: ${sandbox.id}) have been reset.`,
            `Username: ${sandbox.username}`,
            `Password: ${sandbox.password}`,
          ].join("\n"),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to reset sandbox credentials: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default resetSandboxCredentials;
