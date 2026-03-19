import { client } from "../../client";

async function listSendingDomains(): Promise<{
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

    const response = await client.sendingDomains.getList();
    const domains = response?.data ?? [];

    if (domains.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No sending domains found in your Mailtrap account.",
          },
        ],
      };
    }

    const lines = domains.map(
      (d) =>
        `• ${d.domain_name} (ID: ${d.id})\n  DNS verified: ${d.dns_verified} | Compliance: ${d.compliance_status}`
    );
    const text = `Sending domains (${domains.length}):\n\n${lines.join(
      "\n\n"
    )}`;

    return {
      content: [{ type: "text", text }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to list sending domains: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default listSendingDomains;
