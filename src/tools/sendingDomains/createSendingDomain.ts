import { client } from "../../client";
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
    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    const accountId = process.env.MAILTRAP_ACCOUNT_ID;
    if (!accountId || Number.isNaN(Number(accountId))) {
      throw new Error(
        "MAILTRAP_ACCOUNT_ID environment variable is required for sending domains"
      );
    }

    const domain = await client.sendingDomains.create({ domain_name });

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
