import { requireClient } from "../../client";
import { buildSetupInstructionsSection } from "./utils/setupInstructions";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSendingDomain({
  sending_domain_id,
  include_setup_instructions,
}: {
  sending_domain_id: number;
  include_setup_instructions?: boolean;
}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sending domains");

    const domain = await mailtrap.sendingDomains.get(sending_domain_id);

    const payload: Record<string, unknown> = { ...domain };
    if (include_setup_instructions) {
      payload.setup_instructions = buildSetupInstructionsSection(
        domain.domain_name,
        domain.dns_records
      ).trim();
    }

    return buildSuccessResponse(JSON.stringify(payload, null, 2));
  } catch (error) {
    return buildErrorResponse("get sending domain", error);
  }
}

export default getSendingDomain;
