import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteSendingDomain({
  sending_domain_id,
}: {
  sending_domain_id: number;
}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sending domains");

    await mailtrap.sendingDomains.delete(sending_domain_id);

    return buildSuccessResponse(
      `Sending domain ${sending_domain_id} deleted.\n\n${JSON.stringify(
        { sending_domain_id, deleted: true },
        null,
        2
      )}`
    );
  } catch (error) {
    return buildErrorResponse("delete sending domain", error);
  }
}

export default deleteSendingDomain;
