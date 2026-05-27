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

  const { domain_uuids, inbox_ids, project_ids } = parsed.data;

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
