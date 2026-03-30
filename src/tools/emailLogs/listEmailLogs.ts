import { requireClient } from "../../client";
import type { EmailLogMessageDetails } from "../../types/mailtrap";
import {
  listEmailLogsZod,
  listEmailLogsResponseZod,
} from "./schemas/listEmailLogs";
import { buildMessageSummaryLines } from "./utils/emailLogMessageSummary";

/** Normalize to array. Only splits on commas when allowCommaSplit is true. */
function toValueArray(
  v: string | string[] | undefined,
  allowCommaSplit = false
): string[] | undefined {
  if (v === undefined) return undefined;
  if (Array.isArray(v)) return v.length > 0 ? v : undefined;
  const trimmed = String(v).trim();
  if (!trimmed) return undefined;
  if (allowCommaSplit && trimmed.includes(",")) {
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [trimmed];
}

/** Normalize number or number[] to array. */
function toNumberArray(v: number | number[] | undefined): number[] | undefined {
  if (v === undefined) return undefined;
  if (Array.isArray(v)) return v.length > 0 ? v : undefined;
  return [v];
}

/** Operators that support multiple values (array); others require single value. */
const MULTI_VALUE_OPERATORS = new Set([
  "equal",
  "not_equal",
  "ci_equal",
  "ci_not_equal",
]);

function filterValue<T>(values: T[], operator: string | undefined): T | T[] {
  if (values.length > 1) {
    const multi = operator !== undefined && MULTI_VALUE_OPERATORS.has(operator);
    if (!multi) {
      throw new Error(
        `Invalid multi-value/operator combination: multiple values provided but operator "${
          operator ?? "undefined"
        }" does not support multiple values.`
      );
    }
    return values;
  }
  return values[0];
}

async function listEmailLogs(raw: unknown): Promise<{
  content: { type: string; text: string }[];
  isError?: boolean;
}> {
  try {
    const parsed = listEmailLogsZod.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [{ type: "text", text: `Invalid input: ${msg}` }],
        isError: true,
      };
    }

    const params = parsed.data;

    const mailtrap = requireClient("email logs");

    type FilterWithValue =
      | { operator: string; value?: string | string[] }
      | { operator: string; value: number | number[] };
    type Filters = Record<string, string | FilterWithValue>;
    const filters: Filters = {};
    if (params.sent_after !== undefined) filters.sent_after = params.sent_after;
    if (params.sent_before !== undefined)
      filters.sent_before = params.sent_before;
    const fromVal = toValueArray(params.from_email, true);
    if (fromVal !== undefined) {
      filters.from = {
        operator: params.from_operator ?? "ci_equal",
        value: filterValue(fromVal, params.from_operator ?? "ci_equal"),
      };
    }
    const toVal = toValueArray(params.to_email, true);
    if (toVal !== undefined) {
      filters.to = {
        operator: params.to_operator ?? "ci_equal",
        value: filterValue(toVal, params.to_operator ?? "ci_equal"),
      };
    }
    let statusArr: string[] | undefined;
    if (Array.isArray(params.status)) {
      statusArr = params.status.length > 0 ? params.status : undefined;
    } else if (params.status !== undefined) {
      statusArr = [params.status];
    }
    if (statusArr !== undefined) {
      filters.status = {
        operator: params.status_operator ?? "equal",
        value: filterValue(statusArr, params.status_operator ?? "equal"),
      };
    }
    if (
      params.subject_operator === "empty" ||
      params.subject_operator === "not_empty"
    ) {
      filters.subject = { operator: params.subject_operator };
    } else if (params.subject !== undefined) {
      const subjectVal = toValueArray(params.subject);
      if (subjectVal !== undefined) {
        const op = params.subject_operator ?? "ci_contain";
        filters.subject = {
          operator: op,
          value: filterValue(subjectVal, op),
        };
      }
    }
    const domainIdVal = toNumberArray(params.sending_domain_id);
    if (domainIdVal !== undefined) {
      const op = params.sending_domain_id_operator ?? "equal";
      filters.sending_domain_id = {
        operator: op,
        value: filterValue(domainIdVal, op),
      };
    }
    let streamArr: ("transactional" | "bulk")[] | undefined;
    if (Array.isArray(params.sending_stream)) {
      streamArr =
        params.sending_stream.length > 0 ? params.sending_stream : undefined;
    } else if (params.sending_stream !== undefined) {
      streamArr = [params.sending_stream];
    }
    if (streamArr !== undefined) {
      const op = params.sending_stream_operator ?? "equal";
      filters.sending_stream = {
        operator: op,
        value: filterValue(streamArr, op),
      };
    }
    if (
      params.events !== undefined &&
      (Array.isArray(params.events) ? params.events.length > 0 : true)
    ) {
      const eventValues = Array.isArray(params.events)
        ? params.events
        : [params.events];
      filters.events = {
        operator: params.events_operator ?? "include_event",
        value: eventValues,
      };
    }
    if (params.clicks_count !== undefined) {
      filters.clicks_count = {
        operator: params.clicks_count_operator ?? "equal",
        value: params.clicks_count,
      };
    }
    if (params.opens_count !== undefined) {
      filters.opens_count = {
        operator: params.opens_count_operator ?? "equal",
        value: params.opens_count,
      };
    }
    if (params.client_ip !== undefined) {
      filters.client_ip = {
        operator: params.client_ip_operator ?? "equal",
        value: params.client_ip,
      };
    }
    if (params.sending_ip !== undefined) {
      filters.sending_ip = {
        operator: params.sending_ip_operator ?? "equal",
        value: params.sending_ip,
      };
    }
    const espResponseVal = toValueArray(params.email_service_provider_response);
    if (espResponseVal !== undefined) {
      const op =
        params.email_service_provider_response_operator ?? "ci_contain";
      filters.email_service_provider_response = {
        operator: op,
        value: filterValue(espResponseVal, op),
      };
    }
    const espVal = toValueArray(params.email_service_provider);
    if (espVal !== undefined) {
      const op = params.email_service_provider_operator ?? "equal";
      filters.email_service_provider = {
        operator: op,
        value: filterValue(espVal, op),
      };
    }
    const recipientMxVal = toValueArray(params.recipient_mx);
    if (recipientMxVal !== undefined) {
      const op = params.recipient_mx_operator ?? "ci_contain";
      filters.recipient_mx = {
        operator: op,
        value: filterValue(recipientMxVal, op),
      };
    }
    const categoryVal = toValueArray(params.category, true);
    if (categoryVal !== undefined) {
      const op = params.category_operator ?? "equal";
      filters.category = {
        operator: op,
        value: filterValue(categoryVal, op),
      };
    }

    const requestParams: { search_after?: string; filters?: Filters } = {};
    if (params.search_after !== undefined)
      requestParams.search_after = params.search_after;
    if (Object.keys(filters).length > 0) requestParams.filters = filters;

    const rawResponse = await mailtrap.emailLogs.getList(
      Object.keys(requestParams).length > 0 ? requestParams : undefined
    );
    const responseParsed = listEmailLogsResponseZod.safeParse(rawResponse);
    if (!responseParsed.success) {
      const msg = responseParsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        content: [
          {
            type: "text",
            text: `Invalid list response from API: ${msg}`,
          },
        ],
        isError: true,
      };
    }
    const response = responseParsed.data;
    const list = response.messages ?? [];
    const nextPageCursor = response.next_page_cursor ?? null;

    if (list.length === 0) {
      const noLogsText = nextPageCursor
        ? `No email log messages found. Use search_after: "${nextPageCursor}" for pagination.`
        : "No email log messages found.";
      return {
        content: [
          {
            type: "text",
            text: noLogsText,
          },
        ],
      };
    }

    const messageList = list
      .map((entry: Record<string, unknown>) => {
        const id = entry.message_id ?? entry.id ?? "—";
        const summaryLines = buildMessageSummaryLines(
          entry as EmailLogMessageDetails
        );
        return `• Message ID: ${id}\n  ${summaryLines.join("\n  ")}\n`;
      })
      .join("\n");

    let text = `Found ${list.length} email log message(s):\n\n${messageList}`;
    if (nextPageCursor) {
      text += `\nNext page: use search_after: "${nextPageCursor}" to fetch more.`;
    }

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  } catch (error) {
    console.error("Error listing email log messages:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: "text",
          text: `Failed to list email log messages: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

export default listEmailLogs;
