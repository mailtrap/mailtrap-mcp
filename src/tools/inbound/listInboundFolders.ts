import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { listInboundFoldersZod } from "./schemas/listInboundFolders";

async function listInboundFolders(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = listInboundFoldersZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const mailtrap = requireClient("inbound folders", {
      requireAccountId: false,
    });

    const folders = await mailtrap.inbound.folders.getList();

    if (!folders || folders.length === 0) {
      return buildSuccessResponse(
        "No inbound folders in your Mailtrap account."
      );
    }

    const lines = folders.map((f) => `• [${f.id}] ${f.name}`).join("\n");

    return buildSuccessResponse(
      `Found ${folders.length} inbound folder(s):\n\n${lines}`
    );
  } catch (error) {
    return buildErrorResponse("list inbound folders", error);
  }
}

export default listInboundFolders;
