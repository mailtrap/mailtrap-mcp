import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { buildSetupInstructionsSection } from "./utils/setupInstructions";

async function createDomain({
  domain_name,
}: {
  domain_name: string;
}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("domains");

    const domain = await mailtrap.sendingDomains.create({ domain_name });

    let text = [
      `Domain "${domain_name}" created successfully.`,
      `Domain ID: ${domain.id}`,
    ].join("\n");
    text += buildSetupInstructionsSection(
      domain.domain_name,
      domain.dns_records
    );

    return buildSuccessResponse(text);
  } catch (error) {
    return buildErrorResponse("create domain", error);
  }
}

export default createDomain;
