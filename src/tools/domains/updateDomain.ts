import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { splitDomainId } from "../utils/resolveDomainId";
import { updateDomainZod } from "./schema";

async function updateDomain(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = updateDomainZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const [domainId, params] = splitDomainId(parsed.data);

    const mailtrap = requireClient("domains");

    const domain = await mailtrap.sendingDomains.update(domainId, params);

    return buildSuccessResponse(
      [
        `Domain ${domain.domain_name} (ID: ${domain.id}) updated.`,
        `Open tracking: ${domain.open_tracking_enabled}`,
        `Click tracking: ${domain.click_tracking_enabled}`,
        `Tracking opt-out link: ${domain.tracking_opt_out_enabled}`,
        `Auto unsubscribe link: ${domain.auto_unsubscribe_link_enabled}`,
        `Inbound enabled: ${domain.inbound_enabled}`,
      ].join("\n")
    );
  } catch (error) {
    return buildErrorResponse("update domain", error);
  }
}

export default updateDomain;
