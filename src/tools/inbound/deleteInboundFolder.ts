import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { deleteInboundFolderZod } from "./schemas/deleteInboundFolder";

async function deleteInboundFolder(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = deleteInboundFolderZod.safeParse(raw ?? {});
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

    await mailtrap.inbound.folders.delete(folderId);

    return buildSuccessResponse(
      `Inbound folder ${folderId} deleted successfully.`
    );
  } catch (error) {
    return buildErrorResponse("delete inbound folder", error);
  }
}

export default deleteInboundFolder;
