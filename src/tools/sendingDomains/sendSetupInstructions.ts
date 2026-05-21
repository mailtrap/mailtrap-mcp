import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function sendSendingDomainSetupInstructions({
  sending_domain_id,
  email,
}: {
  sending_domain_id: number;
  email: string;
}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sending domains");

    await mailtrap.sendingDomains.sendSetupInstructions(
      sending_domain_id,
      email
    );

    return buildSuccessResponse(
      `DNS setup instructions for sending domain ${sending_domain_id} sent to ${email}.\n\n${JSON.stringify(
        { sending_domain_id, email, sent: true },
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("send sending domain setup instructions", error);
  }
}

export default sendSendingDomainSetupInstructions;
