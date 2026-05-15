import { requireClient } from "../../client";

async function sendSendingDomainSetupInstructions({
  sending_domain_id,
  email,
}: {
  sending_domain_id: number;
  email: string;
}): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sending domains");

    await mailtrap.sendingDomains.sendSetupInstructions(
      sending_domain_id,
      email
    );

    return {
      content: [
        {
          type: "text",
          text: `DNS setup instructions for sending domain ${sending_domain_id} sent to ${email}.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to send sending domain setup instructions: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default sendSendingDomainSetupInstructions;
