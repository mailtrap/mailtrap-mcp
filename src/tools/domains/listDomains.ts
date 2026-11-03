import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listDomains(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("domains");

    const response = await mailtrap.sendingDomains.getList();
    const domains = response?.data ?? [];

    if (domains.length === 0) {
      return buildSuccessResponse("No domains found in your Mailtrap account.");
    }

    const lines = domains.map(
      (d) =>
        `• ${d.domain_name} (ID: ${d.id})\n  DNS verified: ${d.dns_verified} | Compliance: ${d.compliance_status} | Inbound: ${d.inbound_enabled} (verified: ${d.inbound_verified})`
    );
    const text = `Domains (${domains.length}):\n\n${lines.join("\n\n")}`;

    return buildSuccessResponse(text);
  } catch (error) {
    return buildErrorResponse("list domains", error);
  }
}

export default listDomains;
