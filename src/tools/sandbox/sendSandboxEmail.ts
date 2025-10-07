import { Address, Mail } from "mailtrap";
import { sandboxClient } from "../../client";
import { SendSandboxEmailRequest } from "../../types/mailtrap";

const { DEFAULT_FROM_EMAIL } = process.env;

async function sendSandboxEmail({
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
    const { MAILTRAP_TEST_INBOX_ID } = process.env;

    if (!MAILTRAP_TEST_INBOX_ID) {
      throw new Error(
        "MAILTRAP_TEST_INBOX_ID environment variable is required for sandbox mode"
      );
    }

    if (!html && !text) {
      throw new Error("Either HTML or TEXT body is required");
    }

    // Use provided 'from' email or fall back to DEFAULT_FROM_EMAIL
    const fromEmail = from || DEFAULT_FROM_EMAIL;

    if (!fromEmail) {
      throw new Error(
        "No 'from' email provided and no 'DEFAULT_FROM_EMAIL' email set"
      );
    }

    // Check if sandbox client is available
    if (!sandboxClient) {
      throw new Error(
        "Sandbox client is not available. Please set MAILTRAP_TEST_INBOX_ID environment variable."
      );
    }

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
