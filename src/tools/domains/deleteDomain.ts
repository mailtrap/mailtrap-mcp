import { requireClient } from "../../client";
import { DomainIdRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import resolveDomainId from "../utils/resolveDomainId";

async function deleteDomain(args: DomainIdRequest): Promise<ToolResponse> {
  try {
    const domainId = resolveDomainId(args);
    const mailtrap = requireClient("domains");

    await mailtrap.sendingDomains.delete(domainId);

    return buildSuccessResponse(
      `Domain with ID ${domainId} deleted successfully.`
    );
  } catch (error) {
    return buildErrorResponse("delete domain", error);
  }
}

export default deleteDomain;
