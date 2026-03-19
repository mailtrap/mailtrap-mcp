import { Address, Mail } from "mailtrap";
import { getSandboxClient } from "../../client";
import { SendSandboxEmailRequest } from "../../types/mailtrap";

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

    const fromEmail = from ?? process.env.DEFAULT_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error(
        "Provide 'from' or set DEFAULT_FROM_EMAIL environment variable"
      );
    }

    const sandboxClient = getSandboxClient(inboxId);

    const fromAddress: Address = {
      email: fromEmail,
    };

    // Parse and validate email addresses from the 'to' string
    const toEmails = to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (toEmails.length === 0) {
      throw new Error("No valid email addresses provided in 'to' field");
    }

    const toAddresses: Address[] = toEmails.map((email) => ({ email }));

    const emailData: Mail = {
      from: fromAddress,
      to: toAddresses,
      subject,
      text,
      html,
      category,
    };

    if (cc && cc.length > 0) emailData.cc = cc.map((email) => ({ email }));
    if (bcc && bcc.length > 0) emailData.bcc = bcc.map((email) => ({ email }));

    const response = await sandboxClient.send(emailData);

    return {
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${toEmails.join(
            ", "
          )}.\nMessage IDs: ${response.message_ids.join(", ")}\nStatus: ${
            response.success ? "Success" : "Failed"
          }`,
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
