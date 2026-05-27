import { requireClient } from "../../client";
import { CreateApiTokenRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function createApiToken(
  params: CreateApiTokenRequest
): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("API tokens");

    const response = await mailtrap.general.apiTokens.create(
      params as Parameters<typeof mailtrap.general.apiTokens.create>[0]
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("create API token", error);
  }
}

export default createApiToken;
