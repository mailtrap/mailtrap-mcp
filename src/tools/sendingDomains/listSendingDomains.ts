import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listSendingDomains(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("sending domains");

    const response = await mailtrap.sendingDomains.getList();
    const domains = response?.data ?? [];

    return buildSuccessResponse(JSON.stringify(domains, null, 2));
  } catch (error) {
    return buildErrorResponse("list sending domains", error);
  }
}

export default listSendingDomains;
