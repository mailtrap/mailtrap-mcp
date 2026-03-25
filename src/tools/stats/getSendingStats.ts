import { requireClient } from "../../client";
import { getSendingStatsZod } from "./schema";

type SendingStats = {
  delivery_count: number;
  delivery_rate: number;
  bounce_count: number;
  bounce_rate: number;
  open_count: number;
  open_rate: number;
  click_count: number;
  click_rate: number;
  spam_count: number;
  spam_rate: number;
};

type SendingStatGroup = {
  name: string;
  value: string | number;
  stats: SendingStats;
};

function formatStats(stats: SendingStats): string {
  const pct = (r: number) => `${(r * 100).toFixed(2)}%`;
  return [
    `Delivery: ${stats.delivery_count} (${pct(stats.delivery_rate)})`,
    `Bounces: ${stats.bounce_count} (${pct(stats.bounce_rate)})`,
    `Opens: ${stats.open_count} (${pct(stats.open_rate)})`,
    `Clicks: ${stats.click_count} (${pct(stats.click_rate)})`,
    `Spam: ${stats.spam_count} (${pct(stats.spam_rate)})`,
  ].join(" | ");
}

async function getSendingStats(raw: unknown): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const parsed = getSendingStatsZod.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [
          {
            type: "text",
            text: `Invalid input: ${msg}`,
          },
        ],
        isError: true,
      };
    }

    const {
      start_date: startDate,
      end_date: endDate,
      breakdown = "aggregated",
      sending_domain_ids: sendingDomainIds,
      sending_streams: sendingStreams,
      categories,
      email_service_providers: emailServiceProviders,
    } = parsed.data;

    const mailtrap = requireClient("sending stats");

    const params = {
      start_date: startDate,
      end_date: endDate,
      ...(sendingDomainIds?.length && { sending_domain_ids: sendingDomainIds }),
      ...(sendingStreams?.length && { sending_streams: sendingStreams }),
      ...(categories?.length && { categories }),
      ...(emailServiceProviders?.length && {
        email_service_providers: emailServiceProviders,
      }),
    };

    const rangeLabel = `${startDate} to ${endDate}`;

    if (breakdown === "aggregated") {
      const stats = await mailtrap.stats.get(params);
      const lines = [
        `Sending stats (aggregated) for ${rangeLabel}:`,
        "",
        formatStats(stats),
      ];
      return {
        content: [{ type: "text", text: lines.join("\n") }],
      };
    }

    let groups: SendingStatGroup[];
    switch (breakdown) {
      case "by_domain":
        groups = await mailtrap.stats.byDomain(params);
        break;
      case "by_category":
        groups = await mailtrap.stats.byCategory(params);
        break;
      case "by_email_service_provider":
        groups = await mailtrap.stats.byEmailServiceProvider(params);
        break;
      case "by_date":
        groups = await mailtrap.stats.byDate(params);
        break;
      default:
        groups = [];
    }

    const lines = [
      `Sending stats by ${breakdown
        .replace(/^by_/, "")
        .replace(/_/g, " ")} for ${rangeLabel}:`,
      "",
      ...groups.map((g) => `${g.value}: ${formatStats(g.stats)}`),
    ];
    return {
      content: [{ type: "text", text: lines.join("\n") }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Failed to get sending stats: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default getSendingStats;
