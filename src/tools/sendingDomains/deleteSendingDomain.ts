import { client } from "../../client";

async function deleteSendingDomain({
  sending_domain_id,
}: {
  sending_domain_id: number;
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

    await client.sendingDomains.delete(sending_domain_id);

    return {
      content: [
        {
          type: "text",
          text: `Sending domain with ID ${sending_domain_id} deleted successfully.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to delete sending domain: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default deleteSendingDomain;
