import { requireClient } from "../../client";
import { SendDomainSetupInstructionsRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import resolveDomainId from "../utils/resolveDomainId";

async function sendDomainSetupInstructions(
  args: SendDomainSetupInstructionsRequest
): Promise<ToolResponse> {
  try {
    const domainId = resolveDomainId(args);
    const mailtrap = requireClient("domains");

    await mailtrap.sendingDomains.sendSetupInstructions(domainId, args.email);

    return buildSuccessResponse(
      `DNS setup instructions for domain ${domainId} sent to ${args.email}.`
    );
  } catch (error) {
    return buildErrorResponse("send domain setup instructions", error);
  }
}

export default sendDomainSetupInstructions;
