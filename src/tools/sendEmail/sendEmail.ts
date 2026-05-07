import { Mail } from "mailtrap";
import { SendMailToolRequest } from "../../types/mailtrap";
import {
  buildFromAddress,
  normalizeAddressList,
  normalizeToRecipients,
} from "../../utils/mailtrapAddresses";

import { requireClient } from "../../client";

const { DEFAULT_FROM_EMAIL } = process.env;

async function sendEmail({
  from,
  to,
  subject,
  text,
  cc,
  bcc,
  category,
  html,
}: SendMailToolRequest): Promise<{ content: any[]; isError?: boolean }> {
  try {
    const mailtrap = requireClient("sending email", {
      requireAccountId: false,
    });

    if (!html && !text) {
      throw new Error("Either HTML or TEXT body is required");
    }

    const fromAddress = buildFromAddress(from, DEFAULT_FROM_EMAIL);

    const toAddresses = to !== undefined ? normalizeToRecipients(to) : [];
    const ccAddresses = cc && cc.length > 0 ? normalizeAddressList(cc) : [];
    const bccAddresses = bcc && bcc.length > 0 ? normalizeAddressList(bcc) : [];

    if (toAddresses.length + ccAddresses.length + bccAddresses.length === 0) {
      throw new Error(
        "Provide at least one recipient via 'to', 'cc', or 'bcc'"
      );
    }

    const emailData: Mail = {
      from: fromAddress,
      to: toAddresses,
      subject,
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

    const response = await mailtrap.send(emailData);

    const recipientSummary = (
      toAddresses.length > 0 ? toAddresses : [...ccAddresses, ...bccAddresses]
    )
      .map((addr) => addr.email)
      .join(", ");

    return {
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${recipientSummary}.\nMessage IDs: ${
            response.message_ids
          }\nStatus: ${response.success ? "Success" : "Failed"}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to send email: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default sendEmail;
