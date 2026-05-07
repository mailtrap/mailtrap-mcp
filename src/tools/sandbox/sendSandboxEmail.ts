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
  template_uuid,
  template_variables,
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

    if (template_uuid) {
      const forbidden = [
        ["subject", subject],
        ["text", text],
        ["html", html],
        ["category", category],
      ].filter(([, value]) => value !== undefined && value !== "");
      if (forbidden.length > 0) {
        const fields = forbidden.map(([name]) => name).join(", ");
        throw new Error(
          `When 'template_uuid' is set, the following fields must be omitted: ${fields}`
        );
      }
    } else {
      if (!subject) {
        throw new Error("'subject' is required when not using a template");
      }
      if (!html && !text) {
        throw new Error("Either HTML or TEXT body is required");
      }
      if (template_variables !== undefined) {
        throw new Error(
          "'template_variables' can only be used together with 'template_uuid'"
        );
      }
    }

    const fromAddress = buildFromAddress(from, process.env.DEFAULT_FROM_EMAIL);

    const sandboxClient = getSandboxClient(inboxId);

    const toAddresses = to !== undefined ? parseSandboxTo(to) : [];
    const ccAddresses = cc && cc.length > 0 ? normalizeAddressList(cc) : [];
    const bccAddresses = bcc && bcc.length > 0 ? normalizeAddressList(bcc) : [];

    if (toAddresses.length + ccAddresses.length + bccAddresses.length === 0) {
      throw new Error(
        "Provide at least one recipient via 'to', 'cc', or 'bcc'"
      );
    }

    const emailData: Mail = template_uuid
      ? {
          from: fromAddress,
          to: toAddresses,
          template_uuid,
          template_variables,
        }
      : {
          from: fromAddress,
          to: toAddresses,
          subject: subject as string,
          text,
          html,
          category,
        };

    if (ccAddresses.length > 0) {
      emailData.cc = ccAddresses;
    }
    if (bccAddresses.length > 0) {
      emailData.bcc = bccAddresses;
    }

    const response = await sandboxClient.send(emailData);

    const recipientSummary = (
      toAddresses.length > 0 ? toAddresses : [...ccAddresses, ...bccAddresses]
    )
      .map((addr) => addr.email)
      .join(", ");

    return {
      content: [
        {
          type: "text",
          text: `Sandbox email sent successfully to ${recipientSummary}.\nMessage IDs: ${response.message_ids.join(
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
