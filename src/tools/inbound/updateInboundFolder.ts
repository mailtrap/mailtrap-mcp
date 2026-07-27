import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { updateInboundFolderZod } from "./schemas/updateInboundFolder";

async function updateInboundFolder(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = updateInboundFolderZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { folder_id: folderId, name } = parsed.data;

    const mailtrap = requireClient("inbound folders", {
      requireAccountId: false,
    });

    const folder = await mailtrap.inbound.folders.update(folderId, { name });

    return buildSuccessResponse(JSON.stringify(folder, null, 2));
  } catch (error) {
    return buildErrorResponse("update inbound folder", error);
  }
}

export default updateInboundFolder;
