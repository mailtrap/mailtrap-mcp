/**
 * Email string or `{ email, name? }` for Mailtrap `Address` fields (from, to, cc, bcc).
 */
export type MailtrapAddressParam = string | { email: string; name?: string };

export interface SendMailToolRequest {
  from?: MailtrapAddressParam;
  to: MailtrapAddressParam | MailtrapAddressParam[];
  subject: string;
  text?: string;
  html?: string;
  cc?: MailtrapAddressParam[];
  bcc?: MailtrapAddressParam[];
  category: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  html?: string;
  text?: string;
  category?: string;
}

export interface UpdateTemplateRequest {
  template_id: number;
  name?: string;
  subject?: string;
  html?: string;
  text?: string;
  category?: string;
}

export interface DeleteTemplateRequest {
  template_id: number;
}

/**
 * Request interface for sending sandbox emails.
 *
 * @property from - Sender as email string or `{ email, name? }`
 * @property to - Comma-separated emails (legacy), or an array of strings / `{ email, name? }` objects
 * @property subject - Email subject line
 * @property text - Email body text (optional, but either text or html must be provided)
 * @property html - HTML version of the email body (optional, but either text or html must be provided)
 * @property cc - Optional CC recipients
 * @property bcc - Optional BCC recipients
 * @property category - Optional email category for tracking
 *
 * Note: At least one of `text` or `html` must be provided at runtime.
 * The MCP server validates this requirement through runtime checks.
 */
export interface SendSandboxEmailRequest {
  test_inbox_id?: number;
  from?: MailtrapAddressParam;
  to: string | MailtrapAddressParam[];
  subject: string;
  text?: string;
  html?: string;
  cc?: MailtrapAddressParam[];
  bcc?: MailtrapAddressParam[];
  category?: string;
}

export interface GetMessagesRequest {
  test_inbox_id?: number;
  page?: number;
  last_id?: number;
  search?: string;
}

export interface ShowEmailMessageRequest {
  test_inbox_id?: number;
  message_id: number;
  /** When true, include spam report (SpamAssassin score and details). Useful for deliverability testing. */
  include_spam_report?: boolean;
  /** When true, include HTML analysis (compatibility, problematic elements). Useful for email client testing. */
  include_html_analysis?: boolean;
}

/** From/to filter operators (case-insensitive). */
export type EmailLogFromToOperator =
  | "ci_contain"
  | "ci_not_contain"
  | "ci_equal"
  | "ci_not_equal";

/** Status filter operators. */
export type EmailLogStatusOperator = "equal" | "not_equal";

/** Valid status values for email log filters (Mailtrap API). */
export type EmailLogMessageStatus =
  | "delivered"
  | "not_delivered"
  | "enqueued"
  | "opted_out";

/** Subject filter operators (FilterSubject in SDK). */
export type EmailLogSubjectOperator =
  | "ci_contain"
  | "ci_not_contain"
  | "ci_equal"
  | "ci_not_equal"
  | "empty"
  | "not_empty";

/** Sending stream values (Mailtrap API). */
export type EmailLogSendingStream = "transactional" | "bulk";

/** Event types for events filter (Mailtrap API). */
export type EmailLogEventType =
  | "delivery"
  | "open"
  | "click"
  | "bounce"
  | "spam"
  | "unsubscribe"
  | "soft_bounce"
  | "reject"
  | "suspension";

/** Number filter operators (clicks_count, opens_count). */
export type EmailLogNumberOperator = "equal" | "greater_than" | "less_than";

/** IP filter operators (client_ip, sending_ip). */
export type EmailLogIpOperator =
  | "equal"
  | "not_equal"
  | "contain"
  | "not_contain";

/** Events filter operators. */
export type EmailLogEventsOperator = "include_event" | "not_include_event";

export interface ListEmailLogsRequest {
  search_after?: string;
  sent_after?: string;
  sent_before?: string;
  from_email?: string | string[];
  from_operator?: EmailLogFromToOperator;
  to_email?: string | string[];
  to_operator?: EmailLogFromToOperator;
  status?: EmailLogMessageStatus | EmailLogMessageStatus[];
  status_operator?: EmailLogStatusOperator;
  subject?: string | string[];
  subject_operator?: EmailLogSubjectOperator;
  sending_domain_id?: number | number[];
  sending_domain_id_operator?: "equal" | "not_equal";
  sending_stream?: EmailLogSendingStream | EmailLogSendingStream[];
  sending_stream_operator?: "equal" | "not_equal";
  events?: EmailLogEventType | EmailLogEventType[];
  events_operator?: EmailLogEventsOperator;
  clicks_count?: number;
  clicks_count_operator?: EmailLogNumberOperator;
  opens_count?: number;
  opens_count_operator?: EmailLogNumberOperator;
  client_ip?: string;
  client_ip_operator?: EmailLogIpOperator;
  sending_ip?: string;
  sending_ip_operator?: EmailLogIpOperator;
  email_service_provider_response?: string | string[];
  email_service_provider_response_operator?: EmailLogFromToOperator;
  email_service_provider?: string | string[];
  email_service_provider_operator?: "equal" | "not_equal";
  recipient_mx?: string | string[];
  recipient_mx_operator?: EmailLogFromToOperator;
  category?: string | string[];
  category_operator?: "equal" | "not_equal";
}

// --- Sandbox management types ---

export interface CreateProjectRequest {
  name: string;
}

export interface DeleteProjectRequest {
  project_id: number;
}

export interface CreateSandboxInboxRequest {
  project_id: number;
  name: string;
}

export interface GetSandboxInboxRequest {
  inbox_id?: number;
}

export interface UpdateSandboxInboxRequest {
  inbox_id: number;
  name?: string;
  email_username?: string;
}

export interface DeleteSandboxInboxRequest {
  inbox_id: number;
}

export interface CleanSandboxInboxRequest {
  inbox_id: number;
}

// --- Email log types ---

export interface GetEmailLogMessageRequest {
  message_id: string;
  /** When true, fetch raw EML from raw_message_url (if present) and include parsed HTML and text body. */
  include_content?: boolean;
}

/**
 * Shape of a single email log row from client.emailLogs.get() (mailtrap SDK).
 * Defined locally to avoid depending on SDK internals (mailtrap/dist/types/api/email-logs).
 * If the SDK response shape changes, reconcile fields here and in buildMessageSummaryLines / getEmailLogMessage.
 */
export interface EmailLogMessageDetails {
  message_id?: string;
  status?: string;
  from?: string;
  to?: string;
  subject?: string;
  sent_at?: string;
  client_ip?: string;
  category?: string;
  custom_variables?: Record<string, unknown>;
  sending_domain_id?: number;
  sending_stream?: string;
  template_id?: number | null;
  template_variables?: Record<string, unknown>;
  opens_count?: number;
  clicks_count?: number;
  events?: Array<{
    event_type: string;
    created_at: string;
    details?: Record<string, unknown>;
  }>;
  raw_message_url?: string;
  error?: string;
}
