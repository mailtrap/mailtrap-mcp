import { Mail } from "mailtrap";
import { SendMailToolRequest } from "../../types/mailtrap";
import {
  buildFromAddress,
  normalizeAddressList,
  normalizeToRecipients,
} from "../../utils/mailtrapAddresses";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

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
  template_uuid,
  template_variables,
}: SendMailToolRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sending email", {
      requireAccountId: false,
    });

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

    const fromAddress = buildFromAddress(from, DEFAULT_FROM_EMAIL);

    const toAddresses = to !== undefined ? normalizeToRecipients(to) : [];
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

    const response = await mailtrap.send(emailData);

    const recipientSummary = (
      toAddresses.length > 0 ? toAddresses : [...ccAddresses, ...bccAddresses]
    )
      .map((addr) => addr.email)
      .join(", ");

    return buildSuccessResponse(
      `Email sent to ${recipientSummary}.\n\n${JSON.stringify(
        response,
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("send email", error);
  }
}

export default sendEmail;
