import { requireClient } from "../../client";
import { listAccountAccessesZod } from "./schemas/listAccountAccesses";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function listAccountAccesses(raw: unknown = {}): Promise<ToolResponse> {
  const parsed = listAccountAccessesZod.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return buildErrorResponse(
      "list account accesses",
      new Error(`Invalid input: ${msg}`)
    );
  }

  const {
    domain_uuids: domainUuids,
    inbox_ids: inboxIds,
    project_ids: projectIds,
  } = parsed.data;

  try {
    const mailtrap = requireClient("account accesses");

    const filters: {
      domainUuids?: string[];
      inboxIds?: string[];
      projectIds?: string[];
    } = {};
    if (domainUuids) filters.domainUuids = domainUuids;
    if (inboxIds) filters.inboxIds = inboxIds;
    if (projectIds) filters.projectIds = projectIds;

    const accesses = await mailtrap.general.accountAccesses.listAccountAccesses(
      Object.keys(filters).length === 0 ? undefined : filters
    );

    return buildSuccessResponse(JSON.stringify(accesses, null, 2));
  } catch (error) {
    return buildErrorResponse("list account accesses", error);
  }
}

export default listAccountAccesses;
