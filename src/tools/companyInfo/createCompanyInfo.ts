import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createCompanyInfoZod } from "./schemas/createCompanyInfo";

async function createCompanyInfo(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createCompanyInfoZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { sending_domain_id: sendingDomainId, ...params } = parsed.data;

    const mailtrap = requireClient("company info", {
      requireAccountId: false,
    });

    const response = await mailtrap.companyInfo.create(sendingDomainId, params);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("create company info", error);
  }
}

export default createCompanyInfo;
