import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getPermissionResources(): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("permissions");

    const resources = await mailtrap.general.permissions.getResources();

    return buildSuccessResponse(JSON.stringify(resources, null, 2));
  } catch (error) {
    return buildErrorResponse("get permission resources", error);
  }
}

export default getPermissionResources;
