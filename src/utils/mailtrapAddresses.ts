import { Address } from "mailtrap";

import type { MailtrapAddressParam } from "../types/mailtrap";

export function toMailtrapAddress(input: MailtrapAddressParam): Address {
  if (typeof input === "string") {
    return { email: input.trim() };
  }
  const addr: Address = { email: input.email.trim() };
  const name = input.name?.trim();
  if (name) {
    addr.name = name;
  }
  return addr;
}

export function buildFromAddress(
  from: MailtrapAddressParam | undefined,
  defaultEmail: string | undefined
): Address {
  if (from === undefined) {
    if (!defaultEmail) {
      throw new Error(
        "Provide 'from' or set DEFAULT_FROM_EMAIL environment variable"
      );
    }
    return { email: defaultEmail };
  }
  return toMailtrapAddress(from);
}

export function normalizeAddressList(
  inputs: MailtrapAddressParam[]
): Address[] {
  return inputs.flatMap((item) => {
    if (typeof item === "string") {
      const e = item.trim();
      return e.length > 0 ? [{ email: e }] : [];
    }
    const e = item.email?.trim() ?? "";
    if (e.length === 0) {
      return [];
    }
    const addr: Address = { email: e };
    const name = item.name?.trim();
    if (name) {
      addr.name = name;
    }
    return [addr];
  });
}

export function normalizeToRecipients(
  to: MailtrapAddressParam | MailtrapAddressParam[]
): Address[] {
  const list = Array.isArray(to) ? to : [to];
  return normalizeAddressList(list);
}

/** Sandbox `to` as comma-separated string (plain emails) or an array of address params. */
export function parseSandboxTo(to: string | MailtrapAddressParam[]): Address[] {
  if (typeof to === "string") {
    const toEmails = to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (toEmails.length === 0) {
      throw new Error("No valid email addresses provided in 'to' field");
    }
    return toEmails.map((email) => ({ email }));
  }
  const addresses = normalizeAddressList(to);
  if (addresses.length === 0) {
    throw new Error("No valid recipients in 'to' field");
  }
  return addresses;
}
