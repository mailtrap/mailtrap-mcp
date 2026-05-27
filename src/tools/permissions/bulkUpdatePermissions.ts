import { requireClient } from "../../client";
import { BulkUpdatePermissionsRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function bulkUpdatePermissions({
  account_access_id,
  permissions,
}: BulkUpdatePermissionsRequest): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("permissions");

    const sdkPermissions = permissions.map((p) => ({
      resourceId: String(p.resource_id),
      resourceType: p.resource_type,
      ...(p.access_level !== undefined && { accessLevel: p.access_level }),
      ...(p.destroy !== undefined && { destroy: String(p.destroy) }),
    }));

    const response = await mailtrap.general.permissions.bulkPermissionsUpdate(
      account_access_id,
      sdkPermissions
    );

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("bulk update permissions", error);
  }
}

export default bulkUpdatePermissions;
