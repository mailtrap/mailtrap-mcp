import { MailtrapClient } from "mailtrap";
import config from "./config";

const { MAILTRAP_API_TOKEN } = process.env;

// Create client only if API token is available
const client = (
  MAILTRAP_API_TOKEN
    ? new MailtrapClient({
        token: MAILTRAP_API_TOKEN,
        userAgent: config.USER_AGENT,
        // conditionally set accountId if it's a valid number
        ...(process.env.MAILTRAP_ACCOUNT_ID &&
        !Number.isNaN(Number(process.env.MAILTRAP_ACCOUNT_ID))
          ? { accountId: Number(process.env.MAILTRAP_ACCOUNT_ID) }
          : {}),
      })
    : null
) as MailtrapClient;

/**
 * Returns a sandbox MailtrapClient for the given test inbox ID.
 * Use this when you have an inbox ID from tool parameters or env (MAILTRAP_TEST_INBOX_ID).
 */
function getSandboxClient(inboxId: number): MailtrapClient {
  if (!MAILTRAP_API_TOKEN) {
    throw new Error("MAILTRAP_API_TOKEN environment variable is required");
  }
  return new MailtrapClient({
    token: MAILTRAP_API_TOKEN,
    userAgent: config.USER_AGENT,
    testInboxId: inboxId,
    sandbox: true,
    ...(process.env.MAILTRAP_ACCOUNT_ID &&
    !Number.isNaN(Number(process.env.MAILTRAP_ACCOUNT_ID))
      ? { accountId: Number(process.env.MAILTRAP_ACCOUNT_ID) }
      : {}),
  });
}

// eslint-disable-next-line import/prefer-default-export
export { client, getSandboxClient };
