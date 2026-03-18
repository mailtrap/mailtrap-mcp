import type { EmailLogMessageDetails } from "../../../types/mailtrap";
import { isMailtrapEmailLogEvent } from "./emailLogEventFormat";

export function disp(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

/** Readable overview of the message (headers, engagement, delivery context). */
export function buildMessageSummaryLines(
  entry: EmailLogMessageDetails
): string[] {
  const events = entry.events ?? [];
  const evs = events.filter(isMailtrapEmailLogEvent);
  const delivery = evs.find((e) => e.event_type === "delivery");
  const bounce = evs.find(
    (e) => e.event_type === "bounce" || e.event_type === "soft_bounce"
  );
  const deliveryD =
    delivery?.event_type === "delivery" ? delivery.details : undefined;
  const bounceD =
    bounce?.event_type === "bounce" || bounce?.event_type === "soft_bounce"
      ? bounce.details
      : undefined;
  const sendingIp = deliveryD?.sending_ip ?? bounceD?.sending_ip ?? null;
  const recipientMx = deliveryD?.recipient_mx ?? bounceD?.recipient_mx ?? null;
  const esp =
    deliveryD?.email_service_provider ??
    bounceD?.email_service_provider ??
    null;
  const espResponse = bounceD?.email_service_provider_response ?? null;

  const eventsLabel = evs.length
    ? evs.map((e) => e.event_type).join(", ")
    : "—";

  return [
    `From: ${disp(entry.from)}`,
    `To: ${disp(entry.to)}`,
    `Subject: ${disp(entry.subject)}`,
    `Sent: ${disp(entry.sent_at)}`,
    `Status: ${disp(entry.status)}`,
    `Category: ${disp(entry.category)}`,
    `Stream: ${disp(entry.sending_stream)}`,
    `Sending domain ID: ${disp(entry.sending_domain_id)}`,
    `Opens: ${disp(entry.opens_count)} · Link clicks: ${disp(
      entry.clicks_count
    )}`,
    `Client IP: ${disp(entry.client_ip)}`,
    `Events recorded: ${eventsLabel}`,
    `Sending IP: ${disp(sendingIp)}`,
    `Recipient mail server (MX): ${disp(recipientMx)}`,
    `Mailbox provider: ${disp(esp)}`,
    `Bounce / provider response: ${disp(espResponse)}`,
  ];
}
