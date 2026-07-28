import { Address } from "mailtrap";

import type { MailtrapAddressParam } from "../../../types/mailtrap";
import {
  normalizeAddressList,
  normalizeToRecipients,
  toMailtrapAddress,
} from "../../../utils/mailtrapAddresses";

interface EmailAttachmentParam {
  content: string;
  filename: string;
  type?: string;
  disposition?: "attachment" | "inline";
  content_id?: string;
}

export interface RawSendFields {
  from?: unknown;
  to?: unknown;
  cc?: unknown;
  bcc?: unknown;
  reply_to?: unknown;
  text?: string;
  html?: string;
  category?: string;
  attachments?: EmailAttachmentParam[];
  headers?: Record<string, string>;
  custom_variables?: Record<string, string>;
}

export interface InboundSendParams {
  from?: Address;
  to?: Address[];
  cc?: Address[];
  bcc?: Address[];
  reply_to?: Address;
  text?: string;
  html?: string;
  category?: string;
  attachments?: EmailAttachmentParam[];
  headers?: Record<string, string>;
  custom_variables?: Record<string, string>;
}

/**
 * Normalizes the shared send fields (from reply / reply_all / forward) into the
 * SDK's inbound send params. Addresses accept bare strings, `{ email, name? }`
 * objects, and JSON-stringified forms via the shared address normalizers, and
 * empty recipient lists are dropped so they are omitted from the request body.
 */
export function buildInboundSendParams(raw: RawSendFields): InboundSendParams {
  const params: InboundSendParams = {};

  if (raw.from !== undefined) {
    params.from = toMailtrapAddress(raw.from as MailtrapAddressParam, "'from'");
  }
  const to =
    raw.to !== undefined
      ? normalizeToRecipients(
          raw.to as MailtrapAddressParam | MailtrapAddressParam[]
        )
      : [];
  if (to.length > 0) {
    params.to = to;
  }
  const cc =
    raw.cc !== undefined
      ? normalizeAddressList(raw.cc as MailtrapAddressParam[])
      : [];
  if (cc.length > 0) {
    params.cc = cc;
  }
  const bcc =
    raw.bcc !== undefined
      ? normalizeAddressList(raw.bcc as MailtrapAddressParam[])
      : [];
  if (bcc.length > 0) {
    params.bcc = bcc;
  }
  if (raw.reply_to !== undefined) {
    params.reply_to = toMailtrapAddress(
      raw.reply_to as MailtrapAddressParam,
      "'reply_to'"
    );
  }
  if (raw.text !== undefined) {
    params.text = raw.text;
  }
  if (raw.html !== undefined) {
    params.html = raw.html;
  }
  if (raw.category !== undefined) {
    params.category = raw.category;
  }
  if (raw.attachments !== undefined) {
    params.attachments = raw.attachments;
  }
  if (raw.headers !== undefined) {
    params.headers = raw.headers;
  }
  if (raw.custom_variables !== undefined) {
    params.custom_variables = raw.custom_variables;
  }

  return params;
}
