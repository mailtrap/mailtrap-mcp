export interface SendMailToolRequest {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
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
 * @property from - Email address of the sender
 * @property to - Email address(es) of the recipient(s) - comma-separated string
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
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  category?: string;
}

export interface GetMessagesRequest {
  page?: number;
  last_id?: number;
  search?: string;
}

export interface ShowEmailMessageRequest {
  message_id: number;
}
