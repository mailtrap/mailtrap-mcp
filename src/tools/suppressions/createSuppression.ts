import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createSuppressionZod } from "./schemas/createSuppression";

async function createSuppression(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createSuppressionZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const mailtrap = requireClient("suppressions");

    const response = await mailtrap.suppressions.create(parsed.data);

    const created = response.data;

    return buildSuccessResponse(
      `Suppression created: ${created.email} (ID: ${created.id}, type: ${created.type}, stream: ${created.sending_stream}, domain: ${created.domain_name}).`
    );
  } catch (error) {
    return buildErrorResponse("create suppression", error);
  }
}

export default createSuppression;
