import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { updateCompanyInfoZod } from "./schemas/updateCompanyInfo";

async function updateCompanyInfo(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = updateCompanyInfoZod.safeParse(raw ?? {});
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

    const response = await mailtrap.companyInfo.update(sendingDomainId, params);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("update company info", error);
  }
}

export default updateCompanyInfo;
