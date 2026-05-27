import { requireClient } from "../../client";
import {
  BatchSendEmailToolRequest,
  BatchSendEmailBase,
  BatchSendEmailRequest,
} from "../../types/mailtrap";
import {
  buildFromAddress,
  normalizeAddressList,
  normalizeToRecipients,
  toMailtrapAddress,
} from "../../utils/mailtrapAddresses";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

const { DEFAULT_FROM_EMAIL } = process.env;

function ensureNoForbiddenFields(
  source: BatchSendEmailBase | BatchSendEmailRequest,
  scope: string
): void {
  if (source.template_uuid === undefined) {
    if (source.template_variables !== undefined) {
      throw new Error(
        `${scope}: 'template_variables' can only be used together with 'template_uuid'`
      );
    }
    return;
  }
  const forbidden = (
    [
      ["subject", source.subject],
      ["text", source.text],
      ["html", source.html],
      ["category", source.category],
    ] as const
  ).filter(([, value]) => value !== undefined && value !== "");
  if (forbidden.length > 0) {
    const fields = forbidden.map(([name]) => name).join(", ");
    throw new Error(
      `${scope}: when 'template_uuid' is set, the following fields must be omitted: ${fields}`
    );
  }
}

async function batchSendTransactionalEmail({
  base,
  requests,
}: BatchSendEmailToolRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("batch sending transactional email", {
      requireAccountId: false,
    });

    if (!requests || requests.length === 0) {
      throw new Error("'requests' must contain at least one entry");
    }

    if (base) ensureNoForbiddenFields(base, "base");
    requests.forEach((req, i) => {
      // Effective config = base merged with the request's overrides. A request
      // using `template_uuid` cannot also set inline content.
      const merged: BatchSendEmailRequest = {
        ...(base ?? {}),
        ...req,
      } as BatchSendEmailRequest;
      ensureNoForbiddenFields(merged, `requests[${i}]`);

      const hasTemplate = merged.template_uuid !== undefined;
      const hasInlineBody =
        (merged.subject !== undefined && merged.subject !== "") ||
        (merged.text !== undefined && merged.text !== "") ||
        (merged.html !== undefined && merged.html !== "");
      if (!hasTemplate) {
        if (!merged.subject) {
          throw new Error(
            `requests[${i}]: 'subject' is required (either on base or per-request) when not using a template`
          );
        }
        if (!merged.html && !merged.text) {
          throw new Error(
            `requests[${i}]: either 'html' or 'text' body is required when not using a template`
          );
        }
      } else if (hasInlineBody && !merged.template_uuid) {
        // Defensive: should be unreachable after ensureNoForbiddenFields.
        throw new Error(
          `requests[${i}]: cannot mix 'template_uuid' with inline content`
        );
      }
    });

    const fromAddress = buildFromAddress(base?.from, DEFAULT_FROM_EMAIL);

    const sdkBase: Record<string, unknown> = { from: fromAddress };
    if (base?.reply_to) sdkBase.reply_to = toMailtrapAddress(base.reply_to);
    if (base?.subject !== undefined) sdkBase.subject = base.subject;
    if (base?.text !== undefined) sdkBase.text = base.text;
    if (base?.html !== undefined) sdkBase.html = base.html;
    if (base?.category !== undefined) sdkBase.category = base.category;
    if (base?.template_uuid !== undefined)
      sdkBase.template_uuid = base.template_uuid;
    if (base?.template_variables !== undefined)
      sdkBase.template_variables = base.template_variables;
    if (base?.custom_variables !== undefined)
      sdkBase.custom_variables = base.custom_variables;
    if (base?.headers !== undefined) sdkBase.headers = base.headers;

    const sdkRequests = requests.map((req) => {
      const r: Record<string, unknown> = {
        to: normalizeToRecipients(req.to),
      };
      if (req.cc && req.cc.length > 0) r.cc = normalizeAddressList(req.cc);
      if (req.bcc && req.bcc.length > 0) r.bcc = normalizeAddressList(req.bcc);
      if (req.reply_to) r.reply_to = [toMailtrapAddress(req.reply_to)];
      if (req.subject !== undefined) r.subject = req.subject;
      if (req.text !== undefined) r.text = req.text;
      if (req.html !== undefined) r.html = req.html;
      if (req.category !== undefined) r.category = req.category;
      if (req.template_uuid !== undefined) r.template_uuid = req.template_uuid;
      if (req.template_variables !== undefined)
        r.template_variables = req.template_variables;
      if (req.custom_variables !== undefined)
        r.custom_variables = req.custom_variables;
      if (req.headers !== undefined) r.headers = req.headers;
      return r;
    });

    const response = await mailtrap.batchSend({
      base: sdkBase,
      requests: sdkRequests,
    } as unknown as Parameters<typeof mailtrap.batchSend>[0]);

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("batch send transactional email", error);
  }
}

export default batchSendTransactionalEmail;
