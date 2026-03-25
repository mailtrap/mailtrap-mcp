import { requireClient } from "../../client";

async function deleteSendingDomain({
  sending_domain_id,
}: {
  sending_domain_id: number;
}): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const mailtrap = requireClient("sending domains");

    await mailtrap.sendingDomains.delete(sending_domain_id);

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
