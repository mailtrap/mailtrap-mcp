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

// Create a sandbox client instance
const { MAILTRAP_TEST_INBOX_ID } = process.env;

const sandboxClient = (
  MAILTRAP_API_TOKEN &&
  MAILTRAP_TEST_INBOX_ID &&
  !Number.isNaN(Number(process.env.MAILTRAP_TEST_INBOX_ID))
    ? new MailtrapClient({
        token: MAILTRAP_API_TOKEN,
        userAgent: config.USER_AGENT,
        testInboxId: Number(process.env.MAILTRAP_TEST_INBOX_ID),
        sandbox: true,
        // conditionally set accountId if it's a valid number
        ...(process.env.MAILTRAP_ACCOUNT_ID &&
        !Number.isNaN(Number(process.env.MAILTRAP_ACCOUNT_ID))
          ? { accountId: Number(process.env.MAILTRAP_ACCOUNT_ID) }
          : {}),
      })
    : null
) as MailtrapClient;

// eslint-disable-next-line import/prefer-default-export
export { client, sandboxClient };
