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

    // mailtrap@4.8 typings don't know the optional reset body yet – widen the
    // signature locally and drop this cast once the dependency is bumped to
    // the release that ships MT-23076.
    const apiTokens = mailtrap.general.apiTokens as unknown as {
      reset: (
        id: number,
        resetParams?: { expires_at?: string | null }
      ) => Promise<unknown>;
    };

    const response =
      "expires_at" in params
        ? await apiTokens.reset(params.api_token_id, {
            expires_at: params.expires_at,
          })
        : await apiTokens.reset(params.api_token_id);

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("reset API token", error);
  }
}

export default resetApiToken;
