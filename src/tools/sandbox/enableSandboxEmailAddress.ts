import { requireClient } from "../../client";
import { SandboxIdRequest } from "../../types/mailtrap";

async function enableSandboxEmailAddress({
  sandbox_id,
}: SandboxIdRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sandboxes");

    const sandbox = await mailtrap.testing.inboxes.enableEmailAddress(
      sandbox_id
    );

    return {
      content: [
        {
          type: "text",
          text: `Email address for sandbox "${sandbox.name}" (ID: ${sandbox.id}) enabled. Address: ${sandbox.email_username}@${sandbox.email_domain}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to enable sandbox email address: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default enableSandboxEmailAddress;
