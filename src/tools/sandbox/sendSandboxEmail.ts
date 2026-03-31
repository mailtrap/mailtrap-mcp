import { Mail } from "mailtrap";
import { getSandboxClient } from "../../client";
import { SendSandboxEmailRequest } from "../../types/mailtrap";
import {
  buildFromAddress,
  normalizeAddressList,
  parseSandboxTo,
} from "../../utils/mailtrapAddresses";

async function sendSandboxEmail({
  test_inbox_id,
  from,
  to,
  subject,
  text,
  cc,
  bcc,
  category,
  html,
}: SendSandboxEmailRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const inboxIdRaw = test_inbox_id ?? process.env.MAILTRAP_TEST_INBOX_ID;
    if (inboxIdRaw === undefined || inboxIdRaw === null) {
      throw new Error(
        "Provide test_inbox_id or set MAILTRAP_TEST_INBOX_ID environment variable for sandbox mode"
      );
    }

    const inboxId = Number(inboxIdRaw);
    if (Number.isNaN(inboxId)) {
      throw new Error(
        "test_inbox_id (or MAILTRAP_TEST_INBOX_ID) must be a valid number"
      );
    }

    if (!html && !text) {
      throw new Error("Either HTML or TEXT body is required");
    }

    const fromAddress = buildFromAddress(from, process.env.DEFAULT_FROM_EMAIL);

    const sandboxClient = getSandboxClient(inboxId);

    const toAddresses = parseSandboxTo(to);

    const emailData: Mail = {
      from: fromAddress,
      to: toAddresses,
      subject,
      text,
      html,
      category,
    };

    if (cc && cc.length > 0) {
      const ccAddresses = normalizeAddressList(cc);
      if (ccAddresses.length > 0) {
        emailData.cc = ccAddresses;
      }
    }
    if (bcc && bcc.length > 0) {
      const bccAddresses = normalizeAddressList(bcc);
      if (bccAddresses.length > 0) {
        emailData.bcc = bccAddresses;
      }
    }

    const response = await sandboxClient.send(emailData);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${toAddresses
            .map((addr) => addr.email)
            .join(", ")}.\nMessage IDs: ${response.message_ids.join(
            ", "
          )}\nStatus: ${response.success ? "Success" : "Failed"}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error sending sandbox email:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to send sandbox email: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default sendSandboxEmail;
