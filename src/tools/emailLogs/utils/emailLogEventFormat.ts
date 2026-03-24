/** Formats `EmailLogMessageEvent` detail fields (mailtrap SDK) for display. */
export type LogEventDetails = Record<string, unknown>;

export function isMailtrapEmailLogEvent(
  e: unknown
): e is { event_type: string; created_at: string; details?: LogEventDetails } {
  return (
    typeof e === "object" &&
    e !== null &&
    typeof (e as { event_type?: unknown }).event_type === "string" &&
    typeof (e as { created_at?: unknown }).created_at === "string"
  );
}

export function formatEventDetailLines(
  details: LogEventDetails | undefined,
  eventType: string
): string[] {
  if (!details || typeof details !== "object") return [];
  const out: string[] = [];
  const add = (label: string, v: unknown) => {
    if (v != null && String(v) !== "") {
      out.push(`    ${label}: ${v}`);
    }
  };
  switch (eventType) {
    case "delivery":
      add("Sending IP", details.sending_ip);
      add("Recipient mail server (MX)", details.recipient_mx);
      add("Mailbox provider", details.email_service_provider);
      break;
    case "open":
      add("Client IP", details.web_ip_address);
      break;
    case "click":
      add("Clicked URL", details.click_url);
      add("Client IP", details.web_ip_address);
      break;
    case "bounce":
    case "soft_bounce":
      add("Sending IP", details.sending_ip);
      add("Recipient mail server (MX)", details.recipient_mx);
      add("Mailbox provider", details.email_service_provider);
      add("Provider status code", details.email_service_provider_status);
      add("Provider response", details.email_service_provider_response);
      add("Bounce category", details.bounce_category);
      break;
    case "spam":
      add("Spam feedback type", details.spam_feedback_type);
      break;
    case "unsubscribe":
      add("Client IP", details.web_ip_address);
      break;
    case "reject":
    case "suspension":
      add("Reject reason", details.reject_reason);
      break;
    default:
      break;
  }
  return out;
}

export function formatEmailLogEvent(event: unknown): string {
  if (!isMailtrapEmailLogEvent(event)) {
    return `  • (unrecognized event): ${JSON.stringify(event)}`;
  }
  const lines = [`  • ${event.event_type}: ${event.created_at}`];
  lines.push(...formatEventDetailLines(event.details, event.event_type));
  return lines.join("\n");
}
