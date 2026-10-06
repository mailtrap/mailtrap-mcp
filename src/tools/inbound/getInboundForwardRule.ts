import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getInboundForwardRuleZod } from "./schemas/getInboundForwardRule";

async function getInboundForwardRule(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getInboundForwardRuleZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { inbox_id: inboxId, forward_rule_id: forwardRuleId } = parsed.data;

    const mailtrap = requireClient("inbound forward rules", {
      requireAccountId: false,
    });

    const response = await mailtrap.inbound.forwardRules.get(
      inboxId,
      forwardRuleId
    );

    return buildSuccessResponse(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return buildErrorResponse("get inbound forward rule", error);
  }
}

export default getInboundForwardRule;
