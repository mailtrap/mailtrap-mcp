import { requireClient } from "../../client";
import { buildSetupInstructionsSection } from "./utils/setupInstructions";

async function createSendingDomain({
  domain_name,
}: {
  domain_name: string;
}): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sending domains");

    const domain = await mailtrap.sendingDomains.create({ domain_name });

    let text = [
      `Sending domain "${domain_name}" created successfully.`,
      `Domain ID: ${domain.id}`,
    ].join("\n");
    text += buildSetupInstructionsSection(
      domain.domain_name,
      domain.dns_records
    );

    return {
      content: [{ type: "text", text }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to create sending domain: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default createSendingDomain;
