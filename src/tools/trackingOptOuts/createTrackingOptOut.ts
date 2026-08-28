import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createTrackingOptOutZod } from "./schemas/createTrackingOptOut";

async function createTrackingOptOut(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createTrackingOptOutZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const mailtrap = requireClient("tracking opt-outs", {
      requireAccountId: false,
    });

    const response = await mailtrap.trackingOptOuts.create(parsed.data);

    const created = response.data;

    return buildSuccessResponse(
      `Tracking opt-out created: ${created.email} (ID: ${created.id}, domain: ${created.domain_name}, created: ${created.created_at}).`
    );
  } catch (error) {
    return buildErrorResponse("create tracking opt-out", error);
  }
}

export default createTrackingOptOut;
