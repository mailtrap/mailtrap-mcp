import { requireClient } from "../../client";
import { getSendingStatsZod } from "./schema";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getSendingStats(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getSendingStatsZod.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new Error(`Invalid input: ${msg}`);
    }

    const {
      start_date: startDate,
      end_date: endDate,
      breakdown = "aggregated",
      sending_domain_ids: sendingDomainIds,
      sending_streams: sendingStreams,
      categories,
      email_service_providers: emailServiceProviders,
    } = parsed.data;

    const mailtrap = requireClient("sending stats");

    const params = {
      start_date: startDate,
      end_date: endDate,
      ...(sendingDomainIds?.length && { sending_domain_ids: sendingDomainIds }),
      ...(sendingStreams?.length && { sending_streams: sendingStreams }),
      ...(categories?.length && { categories }),
      ...(emailServiceProviders?.length && {
        email_service_providers: emailServiceProviders,
      }),
    };

    let response: unknown;
    switch (breakdown) {
      case "by_domain":
        response = await mailtrap.stats.byDomain(params);
        break;
      case "by_category":
        response = await mailtrap.stats.byCategory(params);
        break;
      case "by_email_service_provider":
        response = await mailtrap.stats.byEmailServiceProvider(params);
        break;
      case "by_date":
        response = await mailtrap.stats.byDate(params);
        break;
      case "aggregated":
      default:
        response = await mailtrap.stats.get(params);
        break;
    }

    return buildSuccessResponse(JSON.stringify(response, null, 2));
  } catch (error) {
    return buildErrorResponse("get sending stats", error);
  }
}

export default getSendingStats;
