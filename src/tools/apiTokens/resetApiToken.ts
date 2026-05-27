import { requireClient } from "../../client";
import { ApiTokenRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function resetApiToken({
  api_token_id,
}: ApiTokenRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("API tokens");

    const response = await mailtrap.general.apiTokens.reset(api_token_id);

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("reset API token", error);
  }
}

export default resetApiToken;
