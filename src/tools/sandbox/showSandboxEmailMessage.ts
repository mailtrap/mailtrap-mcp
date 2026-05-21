import { getSandboxClient } from "../../client";
import { ShowEmailMessageRequest } from "../../types/mailtrap";
import {
  buildErrorResponse,
  buildSuccessResponse,
  ToolResponse,
} from "../utils/responses";

async function showEmailMessage({
  test_inbox_id,
  message_id,
  include_spam_report = false,
  include_html_analysis = false,
}: ShowEmailMessageRequest): Promise<ToolResponse> {
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

    const message = await sandboxClient.testing.messages.showEmailMessage(
      inboxId,
      message_id
    );

    if (!message) {
      throw new Error(`Message with ID ${message_id} not found.`);
    }

    const result: Record<string, unknown> = { ...message };

    try {
      const htmlContent = await sandboxClient.testing.messages.getHtmlMessage(
        inboxId,
        message_id
      );
      if (htmlContent) result.html_content = htmlContent;
    } catch {
      /* body content optional */
    }

    try {
      const textContent = await sandboxClient.testing.messages.getTextMessage(
        inboxId,
        message_id
      );
      if (textContent) result.text_content = textContent;
    } catch {
      /* body content optional */
    }

    if (include_spam_report) {
      try {
        result.spam_report = await sandboxClient.testing.messages.getSpamScore(
          inboxId,
          message_id
        );
      } catch (error) {
        result.spam_report_error =
          error instanceof Error ? error.message : String(error);
      }
    }

    if (include_html_analysis) {
      try {
        result.html_analysis =
          await sandboxClient.testing.messages.getHtmlAnalysis(
            inboxId,
            message_id
          );
      } catch (error) {
        result.html_analysis_error =
          error instanceof Error ? error.message : String(error);
      }
    }

    return buildSuccessResponse(JSON.stringify(result, null, 2));
  } catch (error) {
    return buildErrorResponse("show sandbox email message", error);
  }
}

export default showEmailMessage;
