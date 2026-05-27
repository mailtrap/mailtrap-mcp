import { requireClient } from "../../client";
import { ApiTokenRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function deleteApiToken({
  api_token_id,
}: ApiTokenRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("API tokens");

    const response = (await mailtrap.general.apiTokens.delete(
      api_token_id
    )) as unknown;

    if (response) {
      return buildSuccessResponse(JSON.stringify(response, null, 2));
    }

    return buildSuccessResponse(
      JSON.stringify({ api_token_id, deleted: true }, null, 2)
    );
  } catch (error) {
    return buildErrorResponse("delete API token", error);
  }
}

export default deleteApiToken;
