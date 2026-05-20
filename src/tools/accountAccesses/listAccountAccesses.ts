import { requireClient } from "../../client";
import { ListAccountAccessesRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listAccountAccesses({
  domain_uuids,
  inbox_ids,
  project_ids,
}: ListAccountAccessesRequest = {}): Promise<ToolResponse> {
  try {
    const mailtrap = requireClient("account accesses");

    const filters: {
      domainUuids?: string[];
      inboxIds?: string[];
      projectIds?: string[];
    } = {};
    if (domain_uuids) filters.domainUuids = domain_uuids;
    if (inbox_ids) filters.inboxIds = inbox_ids;
    if (project_ids) filters.projectIds = project_ids;

    const accesses = await mailtrap.general.accountAccesses.listAccountAccesses(
      Object.keys(filters).length === 0 ? undefined : filters
    );

    return buildSuccessResponse(JSON.stringify(accesses, null, 2));
  } catch (error) {
    return buildErrorResponse("list account accesses", error);
  }
}

export default listAccountAccesses;
