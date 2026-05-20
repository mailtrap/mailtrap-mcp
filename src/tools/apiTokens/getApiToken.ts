import { requireClient } from "../../client";
import { ApiTokenRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getApiToken({
  api_token_id,
}: ApiTokenRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("API tokens");

    const token = await mailtrap.general.apiTokens.get(api_token_id);

    return buildSuccessResponse(JSON.stringify(token, null, 2));
  } catch (error) {
    return buildErrorResponse("get API token", error);
  }
}

export default getApiToken;
