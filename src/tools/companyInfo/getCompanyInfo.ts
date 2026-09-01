import { requireClient } from "../../client";
import { GetCompanyInfoRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getCompanyInfo({
  sending_domain_id,
}: GetCompanyInfoRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("company info", {
      requireAccountId: false,
    });

    const response = await mailtrap.companyInfo.get(sending_domain_id);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get company info", error);
  }
}

export default getCompanyInfo;
