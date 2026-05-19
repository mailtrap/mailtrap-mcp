/**
 * Email string or `{ email, name? }` for Mailtrap `Address` fields (from, to, cc, bcc).
 */
export type MailtrapAddressParam = string | { email: string; name?: string };

/**
 * Values that can appear inside `template_variables`. Mirrors the Mailtrap SDK's
 * `TemplateValue` (string | number | boolean | nested array/object), without depending
 * on SDK internals.
 */
export type TemplateVariableValue =
  | string
  | number
  | boolean
  | TemplateVariableValue[]
  | { [key: string]: TemplateVariableValue };

/**
 * Request interface for sending transactional emails.
 *
 * The Mailtrap Send Email API accepts two mutually exclusive request shapes:
 *
 *  - **Inline content**: `subject` + (`text` or `html`), with optional `category`.
 *  - **Template**: `template_uuid` (and optional `template_variables`); per the API,
 *    `subject`, `text`, `html`, and `category` must NOT be sent in this case.
 *
 * Mutual exclusion is enforced at runtime in the handler.
 */
export interface SendMailToolRequest {
  from?: MailtrapAddressParam;
  to?: MailtrapAddressParam | MailtrapAddressParam[];
  subject?: string;
  text?: string;
  html?: string;
  cc?: MailtrapAddressParam[];
  bcc?: MailtrapAddressParam[];
  category?: string;
  template_uuid?: string;
  template_variables?: Record<string, TemplateVariableValue>;
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

export interface GetTemplateRequest {
  template_id: number;
}

/**
 * Request interface for sending sandbox emails.
 *
 * Same two mutually-exclusive request shapes as the production send (see
 * `SendMailToolRequest`): either inline content (`subject` + `text`/`html`) or
 * template (`template_uuid`). Mutual exclusion is enforced at runtime.
 */
export interface SendSandboxEmailRequest {
  test_inbox_id?: number;
  from?: MailtrapAddressParam;
  to?: string | MailtrapAddressParam[];
  subject?: string;
  text?: string;
  html?: string;
  cc?: MailtrapAddressParam[];
  bcc?: MailtrapAddressParam[];
  category?: string;
  template_uuid?: string;
  template_variables?: Record<string, TemplateVariableValue>;
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

export interface GetProjectRequest {
  project_id: number;
}

export interface UpdateProjectRequest {
  project_id: number;
  name: string;
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

/** Common shape for sandbox-scoped actions identified by sandbox_id only. */
export interface SandboxIdRequest {
  sandbox_id: number;
}

/** Common shape for message-scoped sandbox actions. `sandbox_id` is optional; falls back to env. */
export interface SandboxMessageRequest {
  sandbox_id?: number;
  message_id: number;
}

export interface ForwardSandboxMessageRequest extends SandboxMessageRequest {
  email: string;
}

export interface UpdateSandboxMessageRequest extends SandboxMessageRequest {
  is_read: boolean;
}

export interface SandboxAttachmentRequest extends SandboxMessageRequest {
  attachment_id: number;
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

// --- Suppression types ---

export type SuppressionType =
  | "hard bounce"
  | "spam complaint"
  | "unsubscription"
  | "manual import";

export type SuppressionStream = "transactional" | "bulk";

export interface Suppression {
  id: string;
  type: SuppressionType;
  created_at: string;
  email: string;
  sending_stream: SuppressionStream;
  domain_name: string | null;
  message_bounce_category: string | null;
  message_category: string | null;
  message_client_ip: string | null;
  message_created_at: string | null;
  message_outgoing_ip: string | null;
  message_recipient_mx_name: string | null;
  message_sender_email: string | null;
  message_subject: string | null;
}

export interface ListSuppressionsRequest {
  email?: string;
}

export interface DeleteSuppressionRequest {
  suppression_id: string;
}

// --- Webhook types ---

export type WebhookType = "email_sending" | "audit_log";

export type WebhookPayloadFormat = "json" | "jsonlines";

export type WebhookSendingStream = "transactional" | "bulk";

export type WebhookEventType =
  | "delivery"
  | "soft_bounce"
  | "bounce"
  | "suspension"
  | "unsubscribe"
  | "open"
  | "spam_complaint"
  | "click"
  | "reject";

export interface Webhook {
  id: number;
  url: string;
  active: boolean;
  webhook_type: WebhookType;
  payload_format: WebhookPayloadFormat;
  sending_stream?: WebhookSendingStream | null;
  domain_id?: number | null;
  event_types?: WebhookEventType[];
}

export interface WebhookWithSigningSecret extends Webhook {
  signing_secret: string;
}

export interface GetWebhookRequest {
  webhook_id: number;
}

export interface DeleteWebhookRequest {
  webhook_id: number;
}

export interface CreateWebhookRequest {
  url: string;
  webhook_type: WebhookType;
  active?: boolean;
  payload_format?: WebhookPayloadFormat;
  sending_stream?: WebhookSendingStream;
  event_types?: WebhookEventType[];
  domain_id?: number;
}

export interface UpdateWebhookRequest {
  webhook_id: number;
  url?: string;
  active?: boolean;
  payload_format?: WebhookPayloadFormat;
  event_types?: WebhookEventType[];
}
