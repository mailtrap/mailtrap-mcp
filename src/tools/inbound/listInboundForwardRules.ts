import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listInboundForwardRulesZod } from "./schemas/listInboundForwardRules";

async function listInboundForwardRules(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listInboundForwardRulesZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { inbox_id: inboxId } = parsed.data;

    const mailtrap = requireClient("inbound forward rules", {
      requireAccountId: false,
    });

    const response = await mailtrap.inbound.forwardRules.getList(inboxId);
    const rules = response?.data ?? [];

    if (rules.length === 0) {
      return buildSuccessResponse(`No forward rules in inbox ${inboxId}.`);
    }

    const lines = rules
      .map((r) => {
        const destinations =
          r.destinations.map((d) => d.email).join(", ") || "no destinations";
        return `• [${r.id}] ${r.name} — ${r.conditions.length} condition(s) → ${destinations}`;
      })
      .join("\n");

    return buildSuccessResponse(
      `Found ${rules.length} forward rule(s) in inbox ${inboxId}:\n\n${lines}`
    );
  } catch (error) {
    return buildErrorResponse("list inbound forward rules", error);
  }
}

export default listInboundForwardRules;
