import { requireClient } from "../../client";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";
import { createInboundFolderZod } from "./schemas/createInboundFolder";

async function createInboundFolder(raw: unknown): Promise<ToolResponse> {
  try {
    const parsed = createInboundFolderZod.safeParse(raw ?? {});
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const { name } = parsed.data;

    const mailtrap = requireClient("inbound folders", {
      requireAccountId: false,
    });

    const folder = await mailtrap.inbound.folders.create({ name });

    return buildSuccessResponse(JSON.stringify(folder, null, 2));
  } catch (error) {
    return buildErrorResponse("create inbound folder", error);
  }
}

export default createInboundFolder;
