import { getSandboxClient } from "../../client";
import { GetMessagesRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function getMessages({
  test_inbox_id,
  page,
  last_id,
  search,
}: GetMessagesRequest): Promise<ToolResponse> {
  try {
    const inboxIdRaw = test_inbox_id ?? process.env.MAILTRAP_TEST_INBOX_ID;
    if (inboxIdRaw === undefined || inboxIdRaw === null) {
      throw new Error(
        "Provide test_inbox_id or set MAILTRAP_TEST_INBOX_ID environment variable for sandbox mode"
      );
    }

    const inboxId = Number(inboxIdRaw);
    if (Number.isNaN(inboxId)) {
      throw new Error(
        "test_inbox_id (or MAILTRAP_TEST_INBOX_ID) must be a valid number"
      );
    }

    const sandboxClient = getSandboxClient(inboxId);

    const options: { page?: number; last_id?: number; search?: string } = {};
    if (page !== undefined) options.page = page;
    if (last_id !== undefined) options.last_id = last_id;
    if (search !== undefined) options.search = search;

    const messages = await sandboxClient.testing.messages.get(
      inboxId,
      Object.keys(options).length > 0 ? options : undefined
    );

    return buildSuccessResponse(JSON.stringify(messages ?? [], null, 2));
  } catch (error) {
    return buildErrorResponse("get sandbox messages", error);
  }
}

export default getMessages;
