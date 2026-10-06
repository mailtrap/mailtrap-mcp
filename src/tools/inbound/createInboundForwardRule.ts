import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createInboundForwardRuleZod } from "./schemas/createInboundForwardRule";

async function createInboundForwardRule(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createInboundForwardRuleZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { inbox_id: inboxId, ...params } = parsed.data;

    const mailtrap = requireClient("inbound forward rules", {
      requireAccountId: false,
    });

    const response = await mailtrap.inbound.forwardRules.create(
      inboxId,
      params
    );

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("create inbound forward rule", error);
  }
}

export default createInboundForwardRule;
