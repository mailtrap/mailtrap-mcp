const DOCS_DNS_RECORDS =
  "https://docs.mailtrap.io/email-api-smtp/help/glossary#dns-record-types";
const DOCS_ADD_RECORDS =
  "https://docs.mailtrap.io/email-api-smtp/setup/sending-domain";

export type DnsRecord = {
  key: string;
  type: string;
  name: string;
  value: string;
  status: string;
};

export function formatSetupInstructionsDnsTable(
  dnsRecords: DnsRecord[]
): string {
  if (!dnsRecords?.length) {
    return "  (no DNS records to add)";
  }
  const rows = dnsRecords.map(
    (r) =>
      `  ${r.key}\t${r.type}\t${r.name || "(root)"}\t${r.value}\t${r.status}`
  );
  return ["  Key\tType\tName\tValue\tStatus", ...rows].join("\n");
}

export function buildSetupInstructionsSection(
  domainName: string,
  dnsRecords: DnsRecord[] | undefined
): string {
  const records = dnsRecords ?? [];
  const what = [
    "The domain has been added to Mailtrap. To verify ownership, add the DNS records below to your domain provider.",
    `Learn more: what DNS records are (${DOCS_DNS_RECORDS}), how to add DNS records (${DOCS_ADD_RECORDS}).`,
  ].join(" ");
  const why = "Verification proves you own the domain.";
  const dnsTable = formatSetupInstructionsDnsTable(records);
  return [
    "",
    "---",
    "",
    `Add DNS records for ${domainName}`,
    "",
    "What?",
    what,
    "",
    "Why?",
    why,
    "",
    "DNS records to add:",
    dnsTable,
  ].join("\n");
}
