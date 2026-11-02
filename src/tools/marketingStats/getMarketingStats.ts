import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getMarketingStatsZod } from "./schema";

async function getMarketingStats(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getMarketingStatsZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const mailtrap = requireClient("marketing stats", {
      requireAccountId: false,
    });

    const response = await mailtrap.marketingStats.get(parsed.data);

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get marketing stats", error);
  }
}

export default getMarketingStats;
