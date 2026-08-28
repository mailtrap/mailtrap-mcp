import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { updateSendingDomainZod } from "./schema";

async function updateSendingDomain(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = updateSendingDomainZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { sending_domain_id: sendingDomainId, ...params } = parsed.data;

    const mailtrap = requireClient("sending domains");

    const domain = await mailtrap.sendingDomains.update(
      sendingDomainId,
      params
    );

    return buildSuccessResponse(
      [
        `Sending domain ${domain.domain_name} (ID: ${domain.id}) updated.`,
        `Open tracking: ${domain.open_tracking_enabled}`,
        `Click tracking: ${domain.click_tracking_enabled}`,
        `Tracking opt-out link: ${domain.tracking_opt_out_enabled}`,
        `Auto unsubscribe link: ${domain.auto_unsubscribe_link_enabled}`,
        `Inbound enabled: ${domain.inbound_enabled}`,
      ].join("\n")
    );
  } catch (error) {
    return buildErrorResponse("update sending domain", error);
  }
}

export default updateSendingDomain;
