import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { deleteInboundForwardRuleZod } from "./schemas/deleteInboundForwardRule";

async function deleteInboundForwardRule(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = deleteInboundForwardRuleZod.safeParse(raw ?? {});
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

    await mailtrap.inbound.forwardRules.delete(inboxId, forwardRuleId);

    return buildSuccessResponse(
      `Inbound forward rule ${forwardRuleId} deleted successfully.`
    );
  } catch (error) {
    return buildErrorResponse("delete inbound forward rule", error);
  }
}

export default deleteInboundForwardRule;
