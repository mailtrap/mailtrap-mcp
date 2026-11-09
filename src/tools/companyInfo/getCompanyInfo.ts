import { requireClient } from "../../client";
import { GetCompanyInfoRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import resolveDomainId from "../utils/resolveDomainId";

async function getCompanyInfo(
  args: GetCompanyInfoRequest
): Promise<ToolResponse> {
  try {
    const domainId = resolveDomainId(args);
    const mailtrap = requireClient("company info", {
      requireAccountId: false,
    });

    const response = await mailtrap.companyInfo.get(domainId);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get company info", error);
  }
}

export default getCompanyInfo;
