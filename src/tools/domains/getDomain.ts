import { requireClient } from "../../client";
import { GetDomainRequest } from "../../types/mailtrap";
import resolveDomainId from "../utils/resolveDomainId";
import { buildSetupInstructionsSection } from "./utils/setupInstructions";

async function getDomain(args: GetDomainRequest): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const domainId = resolveDomainId(args);
    const mailtrap = requireClient("domains");

    const domain = await mailtrap.sendingDomains.get(domainId);

    const dnsSummary =
      domain.dns_records?.length > 0
        ? domain.dns_records
            .map(
              (r) =>
                `  - ${r.key}: type=${r.type}, name=${
                  r.name || "(root)"
                }, status=${r.status}`
            )
            .join("\n")
        : "  (no DNS records)";

    let text = [
      `Domain: ${domain.domain_name} (ID: ${domain.id})`,
      `Demo: ${domain.demo}`,
      `Compliance: ${domain.compliance_status}`,
      `DNS verified: ${domain.dns_verified}`,
      domain.dns_verified_at
        ? `DNS verified at: ${domain.dns_verified_at}`
        : null,
      `Inbound enabled: ${domain.inbound_enabled}`,
      `Inbound verified: ${domain.inbound_verified}`,
      "",
      "DNS records:",
      dnsSummary,
    ]
      .filter(Boolean)
      .join("\n");

    if (args.include_setup_instructions) {
      text += buildSetupInstructionsSection(
        domain.domain_name,
        domain.dns_records
      );
    }

    return {
      content: [{ type: "text", text }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get domain: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getDomain;
