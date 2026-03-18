import type { EmailLogMessageDetails } from "../../../types/mailtrap";

/** Shared row matching `client.emailLogs.get()` (mailtrap SDK). */
const mockEmailLogWithEvents: EmailLogMessageDetails = {
  message_id: "msg-uuid-123",
  status: "delivered",
  from: "sender@example.com",
  to: "user@example.com",
  subject: "Welcome",
  sent_at: "2024-01-01T12:00:00Z",
  client_ip: "192.0.2.10",
  category: "Onboarding",
  custom_variables: {},
  sending_domain_id: 42,
  sending_stream: "transactional",
  template_id: null,
  template_variables: {},
  opens_count: 3,
  clicks_count: 1,
  events: [
    {
      event_type: "delivery",
      created_at: "2024-01-01T12:00:01Z",
      details: {
        sending_ip: "203.0.113.1",
        recipient_mx: "mx.example.com",
        email_service_provider: "Example ESP",
      },
    },
    {
      event_type: "open",
      created_at: "2024-01-01T12:00:05Z",
      details: { web_ip_address: "198.51.100.2" },
    },
  ],
};

export default mockEmailLogWithEvents;
