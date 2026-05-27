import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listApiTokens(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("API tokens");

    const tokens = await mailtrap.general.apiTokens.getList();

    return buildSuccessResponse(JSON.stringify(tokens, null, 2));
  } catch (error) {
    return buildErrorResponse("list API tokens", error);
  }
}

export default listApiTokens;
