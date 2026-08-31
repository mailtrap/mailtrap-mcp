import { requireClient } from "../../client";
import { ResetApiTokenRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function resetApiToken(
  params: ResetApiTokenRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("API tokens");

    const response =
      "expires_at" in params
        ? await mailtrap.general.apiTokens.reset(params.api_token_id, {
            expires_at: params.expires_at,
          })
        : await mailtrap.general.apiTokens.reset(params.api_token_id);

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("reset API token", error);
  }
}

export default resetApiToken;
