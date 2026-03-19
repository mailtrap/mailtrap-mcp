import {
  buildMessageSummaryLines,
  disp,
} from "../utils/emailLogMessageSummary";
import mockEmailLogWithEvents from "../fixtures/emailLogMessageFixtures";

describe("emailLogMessageSummary", () => {
  describe("disp", () => {
    it("returns em dash for nullish and empty string", () => {
      expect(disp(null)).toBe("—");
      expect(disp(undefined)).toBe("—");
      expect(disp("")).toBe("—");
    });

    it("stringifies other values", () => {
      expect(disp("x")).toBe("x");
      expect(disp(42)).toBe("42");
      expect(disp(true)).toBe("true");
    });
  });

  describe("buildMessageSummaryLines", () => {
    it("builds human-readable lines from log entry", () => {
      const lines = buildMessageSummaryLines(mockEmailLogWithEvents);
      const text = lines.join("\n");
      expect(text).toContain("From: sender@example.com");
      expect(text).toContain("To: user@example.com");
      expect(text).toContain("Subject: Welcome");
      expect(text).toContain("Sent: 2024-01-01T12:00:00Z");
      expect(text).toContain("Status: delivered");
      expect(text).toContain("Opens: 3 · Link clicks: 1");
      expect(text).toContain("Events recorded: delivery, open");
      expect(text).toContain("Sending IP: 203.0.113.1");
      expect(text).toContain("Recipient mail server (MX): mx.example.com");
      expect(text).toContain("Mailbox provider: Example ESP");
    });

    it("includes bounce provider response from soft_bounce event", () => {
      const lines = buildMessageSummaryLines({
        ...mockEmailLogWithEvents,
        events: [
          {
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
          },
        ],
      });
      expect(lines.join("\n")).toContain(
        "Bounce / provider response: Mailbox unavailable"
      );
    });
  });
});
