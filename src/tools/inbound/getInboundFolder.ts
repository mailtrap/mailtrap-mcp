import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { getInboundFolderZod } from "./schemas/getInboundFolder";

async function getInboundFolder(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = getInboundFolderZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { folder_id: folderId } = parsed.data;

    const mailtrap = requireClient("inbound folders", {
      requireAccountId: false,
    });

    const folder = await mailtrap.inbound.folders.get(folderId);

    return buildSuccessResponse(JSON.stringify(folder, null, 2));
  } catch (error) {
    return buildErrorResponse("get inbound folder", error);
  }
}

export default getInboundFolder;
