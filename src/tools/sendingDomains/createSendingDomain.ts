import { requireClient } from "../../client";
import { buildSetupInstructionsSection } from "./utils/setupInstructions";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createSendingDomain({
  domain_name,
}: {
  domain_name: string;
}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sending domains");

    const domain = await mailtrap.sendingDomains.create({ domain_name });

    const payload: Record<string, unknown> = {
      ...domain,
      setup_instructions: buildSetupInstructionsSection(
        domain.domain_name,
        domain.dns_records
      ).trim(),
    };

    return buildSuccessResponse(
      `Sending domain "${domain_name}" created.\n\n${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("create sending domain", error);
  }
}

export default createSendingDomain;
