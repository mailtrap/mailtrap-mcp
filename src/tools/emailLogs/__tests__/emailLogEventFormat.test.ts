import { formatEmailLogEvent } from "../utils/emailLogEventFormat";

describe("emailLogEventFormat", () => {
  describe("formatEmailLogEvent", () => {
    it("formats delivery with detail lines", () => {
      const text = formatEmailLogEvent({
        event_type: "delivery",
        created_at: "2024-01-01T12:00:01Z",
        details: {
          sending_ip: "203.0.113.1",
          recipient_mx: "mx.example.com",
          email_service_provider: "Example ESP",
        },
      });
      expect(text).toContain("delivery: 2024-01-01T12:00:01Z");
      expect(text).toContain("Sending IP: 203.0.113.1");
      expect(text).toContain("Recipient mail server (MX): mx.example.com");
      expect(text).toContain("Mailbox provider: Example ESP");
    });

    it("formats open with client IP", () => {
      const text = formatEmailLogEvent({
        event_type: "open",
        created_at: "2024-01-01T12:00:05Z",
        details: { web_ip_address: "198.51.100.2" },
      });
      expect(text).toContain("open: 2024-01-01T12:00:05Z");
      expect(text).toContain("Client IP: 198.51.100.2");
    });

    it("formats soft_bounce with provider response fields", () => {
      const text = formatEmailLogEvent({
        event_type: "soft_bounce",
        created_at: "2024-01-01T13:00:00Z",
        details: {
          sending_ip: "203.0.113.9",
          recipient_mx: "mx.bounce.example",
          email_service_provider: "Bounce ESP",
          email_service_provider_status: "550",
          email_service_provider_response: "Mailbox unavailable",
          bounce_category: "hard",
        },
      });
      expect(text).toContain("soft_bounce: 2024-01-01T13:00:00Z");
      expect(text).toContain("Sending IP: 203.0.113.9");
      expect(text).toContain("Provider response: Mailbox unavailable");
    });

    it("formats unrecognized event as JSON", () => {
      const text = formatEmailLogEvent({ foo: "bar" });
      expect(text).toContain("(unrecognized event)");
      expect(text).toContain("foo");
    });
  });
});
