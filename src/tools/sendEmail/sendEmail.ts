import { Address, Mail } from "mailtrap";
import { SendMailToolRequest } from "../../types/mailtrap";

import { client } from "../../client";

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
    if (!client) {
      throw new Error("MAILTRAP_API_TOKEN environment variable is required");
    }

    if (!html && !text) {
      throw new Error("Either HTML or TEXT body is required");
    }

    const fromEmail = from ?? DEFAULT_FROM_EMAIL;

    if (!fromEmail) {
      throw new Error(
        "No 'from' email provided and no 'DEFAULT_FROM_EMAIL' email set"
      );
    }

    const fromAddress: Address = {
      email: fromEmail,
    };

    // Handle both single email and array of emails
    // Normalize inputs: convert to array, trim each email, filter empty strings
    const normalizedToEmails = (Array.isArray(to) ? to : [to])
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Validate that we have at least one valid recipient after normalization
    if (normalizedToEmails.length === 0) {
      throw new Error(
        "No valid recipients provided in 'to' field after normalization"
      );
    }

    const toAddresses: Address[] = normalizedToEmails.map((email) => ({
      email,
    }));

    const emailData: Mail = {
      from: fromAddress,
      to: toAddresses,
      subject,
      text,
      html,
      category,
    };

    if (cc && cc.length > 0) {
      const normalizedCcEmails = cc
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
      if (normalizedCcEmails.length > 0) {
        emailData.cc = normalizedCcEmails.map((email) => ({ email }));
      }
    }
    if (bcc && bcc.length > 0) {
      const normalizedBccEmails = bcc
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
      if (normalizedBccEmails.length > 0) {
        emailData.bcc = normalizedBccEmails.map((email) => ({ email }));
      }
    }

    const response = await client.send(emailData);

    return {
      content: [
        {
          type: "text",
          text: `Email sent successfully to ${toAddresses
            .map((addr) => addr.email)
            .join(", ")}.\nMessage IDs: ${response.message_ids}\nStatus: ${
            response.success ? "Success" : "Failed"
          }`,
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
